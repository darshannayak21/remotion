import cv2
import time
import threading
import sys
from dotenv import load_dotenv

# Load env variables (API keys)
load_dotenv()

from pose_detection import PoseDetector
from angle_utils import is_full_body_visible
from state_manager import FlexStateManager, SystemMode
from feedback_engine import FeedbackEngine

from exercises.exercise_config import EXERCISE_CONFIG
from exercises.exercise_standards_mediapipe import EXERCISE_STANDARDS
from pose_analyzer_mediapipe import MediaPipePoseAnalyzer

from audio.voice_engine import VoiceEngine
from audio.ai_handler import AIHandler
from audio.wake_word import WakeWordEngine

class FlexSystem:
    def __init__(self, exercise_name: str):
        self.exercise_name = exercise_name
        self.config = EXERCISE_CONFIG.get(exercise_name)
        self.visual_config = EXERCISE_STANDARDS.get(exercise_name)
        
        if not self.config or not self.visual_config:
            print(f"Exercise '{exercise_name}' not found.", file=sys.stderr)
            sys.exit(1)

        print("[FLEX] Initializing AI Physiotherapy Core...")
        
        # Modules
        self.state = FlexStateManager()
        self.detector = PoseDetector(use_high_accuracy=True)
        self.visual_analyzer = MediaPipePoseAnalyzer(tolerance_degrees=5, visibility_threshold=0.60)
        self.feedback = FeedbackEngine(persistence_time=1.0, cooldown_time=4.0)
        self.voice = VoiceEngine(voice="aura-luna-en") # Human-like Deepgram Aura voice
        self.ai = AIHandler()
        
        # Wake word daemon
        self.wake_word = WakeWordEngine(callback=self._handle_wake_word)
        self.wake_word.start()

        # Timers and state vars
        self.body_detected_time = 0
        self.exercise_start_time = 0
        self.last_idle_prompt = 0
        
        # Latest context for AI
        self.latest_context = {}
        self.is_conversing = False

    def _handle_wake_word(self):
        """Callback from WakeWordEngine thread."""
        self.voice.stop() # Unconditionally break any playing TTS
        
        if self.is_conversing:
            # Re-trigger LISTENING on the existing loop if they interrupt
            self.state.set_mode(SystemMode.LISTENING)
            return

        self.is_conversing = True
        self.state.set_mode(SystemMode.SPEAKING)
        
        def run_loop():
            self.ai.execute_conversational_loop(self.state, lambda: self.latest_context, self.voice, self.exercise_name)
            self.is_conversing = False
            
        threading.Thread(target=run_loop, daemon=True).start()

    def _trigger_escalation(self):
        """Called by FeedbackEngine when same mistake repeats too many times."""
        self.state.set_mode(SystemMode.SPEAKING)
        self.voice.stop()
        threading.Thread(target=self._run_ai_escalation, daemon=True).start()

    def _run_ai_escalation(self):
        """Handles Gemini escalation logic without user voice query."""
        if not self.latest_context["errors"]:
            answer = "I thought I saw an issue, but you look good now. Keep going!"
        else:
            answer = self.ai.get_gemini_escalation(self.latest_context)
        
        # Prevent speaking escalation if they triggered the Q&A loop while Llama was generating
        if getattr(self, "is_conversing", False):
            return

        self.voice.speak(answer, block=True)
        
        # Only drop back to coaching if not interrupted!
        if not getattr(self, "is_conversing", False):
            self.state.set_mode(SystemMode.ACTIVE_COACHING)
        
    def _run_ai_live_cue(self, error, context):
        """Background thread to generate and play a dynamic live cue."""
        if self.state.is_ai_active():
            return # Block live cues if we are currently in a conversation
            
        cue = self.ai.get_gemini_live_cue(error, context)
        self.voice.speak(cue, block=False)

    def run(self, camera_id=0):
        cap = cv2.VideoCapture(camera_id)
        if not cap.isOpened():
            print(f"[!] Cannot open camera {camera_id}.")
            return

        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        print(f"\n[FLEX] System Ready. Target: {self.exercise_name}")
        print("[FLEX] Say 'hey flex' anytime to ask questions.")
        print("[FLEX] Press 'q' to quit.")

        self.state.set_mode(SystemMode.IDLE)

        try:
            while True:
                ret, frame = cap.read()
                if not ret: continue
                
                annotated = frame.copy()
                results = self.detector.process_frame(frame)
                landmarks, vis_scores = self.detector.extract_landmarks(results)
                
                mode = self.state.current_mode
                
                # ── Legacy Visual HUD & Skeleton Overlay ──
                if results and results.pose_landmarks and landmarks is not None:
                    vis_analysis = self.visual_analyzer.analyze_exercise(
                        landmarks, vis_scores, self.visual_config, w, h
                    )
                    annotated = self.visual_analyzer.draw_feedback(
                        annotated, vis_analysis, results.pose_landmarks, self.exercise_name
                    )

                # ── System Mode HUD ──
                cv2.putText(annotated, f"MODE: {mode.name}", (w - 300, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

                if landmarks is not None:
                    # ── Universal Telemetry Tracking ──
                    if mode in [SystemMode.ACTIVE_COACHING, SystemMode.LISTENING, SystemMode.SPEAKING]:
                        # Constantly update live context regardless of conversation state
                        self.latest_context = self.feedback.evaluate_frame(landmarks, vis_scores, self.config, w, h)
                        
                    # ── State Machine Logic ──
                    if mode == SystemMode.IDLE:
                        if is_full_body_visible(landmarks, vis_scores):
                            self.state.set_mode(SystemMode.BODY_DETECTED)
                            self.body_detected_time = time.time()

                    elif mode == SystemMode.BODY_DETECTED:
                        # Wait 2 seconds for stability
                        if time.time() - self.body_detected_time > 2.0:
                            if is_full_body_visible(landmarks, vis_scores):
                                self.voice.speak("Great, I can see you clearly.")
                                self.state.set_mode(SystemMode.STARTING_EXERCISE)
                                
                                # Play intro
                                intro_text = self.config.get("intro", ["Let's begin."])[0]
                                self.voice.speak(intro_text)
                                self.exercise_start_time = time.time()
                            else:
                                self.state.set_mode(SystemMode.IDLE) # Lost them

                    elif mode == SystemMode.STARTING_EXERCISE:
                        cv2.putText(annotated, "GET READY", (15, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 255, 255), 2)
                        # Wait until voice finishes, plus 2 seconds
                        if not self.voice.is_playing and (time.time() - self.exercise_start_time > 2.0):
                            self.state.set_mode(SystemMode.ACTIVE_COACHING)

                    elif mode == SystemMode.ACTIVE_COACHING:
                        # Real-time evaluation triggers cues only when fully coaching
                        if not self.voice.is_playing and not self.state.is_ai_active():
                            cue_or_error, escalate = self.feedback.get_coaching_cue(self.latest_context)
                            
                            if escalate:
                                self._trigger_escalation()
                            elif cue_or_error:
                                if isinstance(cue_or_error, dict):
                                    # Launch fast background thread to fetch Gemini cue so CV doesn't stutter
                                    threading.Thread(target=self._run_ai_live_cue, args=(cue_or_error, self.latest_context), daemon=True).start()
                                else:
                                    # Standard string praise cue
                                    self.voice.speak(cue_or_error)

                    elif mode == SystemMode.LISTENING:
                        cv2.putText(annotated, "LISTENING TO YOU...", (w // 2 - 180, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 255, 0), 2)

                    elif mode == SystemMode.SPEAKING:
                        cv2.putText(annotated, "AI SPEAKING...", (w // 2 - 150, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 0, 255), 2)

                else:
                    # No landmarks at all
                    cv2.putText(annotated, "NO PERSON DETECTED", (w // 2 - 150, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 0, 255), 2)
                    if not self.state.is_ai_active():
                        self.state.set_mode(SystemMode.IDLE)
                        
                # ── Global Out-Of-Bounds Prompt ──
                # If they are cut off or entirely off camera, loudly instruct them back every 10 seconds.
                _is_out_of_bounds = (landmarks is None) or (not is_full_body_visible(landmarks, vis_scores))
                if self.state.current_mode == SystemMode.IDLE and _is_out_of_bounds:
                    if time.time() - self.last_idle_prompt > 10.0 and not self.voice.is_playing:
                        self.voice.speak("I cannot see your full body. Please step back into the camera frame.")
                        self.last_idle_prompt = time.time()
                    cv2.putText(annotated, "PLEASE STEP BACK", (15, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 0, 255), 2)

                cv2.imshow("FLEX Live Physiotherapy Assistant", annotated)
                
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    print("[FLEX] Exiting...")
                    break
                elif key == ord('f'):
                    print("[FLEX] Manual AI Trigger (Key 'F')")
                    self._handle_wake_word()
                    
        except KeyboardInterrupt:
            print("\n[FLEX] Interrupted.")
        finally:
            self.wake_word.stop()
            self.voice.stop()
            self.detector.close()
            cap.release()
            cv2.destroyAllWindows()


def display_menu():
    print("\n" + "=" * 60)
    print("                FLEX COACHING MENU")
    print("=" * 60)
    
    exercises = list(EXERCISE_CONFIG.keys())
    for i, ex in enumerate(exercises, 1):
        print(f" [{i:2d}] {ex.replace('_', ' ').title()}")
    print("=" * 60)
    
    while True:
        choice = input("Enter number (or 'q' to quit): ").strip()
        if choice.lower() == 'q':
            sys.exit(0)
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(exercises):
                return exercises[idx]
        except ValueError:
            pass
        print("Invalid choice, please try again.")

if __name__ == "__main__":
    target = display_menu()
    system = FlexSystem(target)
    system.run()

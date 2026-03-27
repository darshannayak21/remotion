"""
MediaPipe Physiotherapy System - POST-DISCHARGE EDITION
- High Accuracy Mode (Complexity 2 enforced)
- Rehab-specific exercises
- Real-time Angle Feedback
"""

import cv2  # type: ignore
import mediapipe as mp  # type: ignore
import numpy as np  # type: ignore
import time
import sys
from typing import Any
from pose_analyzer_mediapipe import MediaPipePoseAnalyzer  # type: ignore
from exercises.exercise_standards_mediapipe import EXERCISE_STANDARDS, EXERCISE_CATEGORIES  # type: ignore


# ─────────────────────────────────────────────────────────────────────────────
# System Banner
# ─────────────────────────────────────────────────────────────────────────────
BANNER = """
╔═════════════════════════════════════════════════════════════════════════════╗
║       POST-DISCHARGE PHYSIOTHERAPY ASSISTANT - v3.0                        ║
║       High Precision Mode | Bilateral Detection | Rehab Focused             ║
╚═════════════════════════════════════════════════════════════════════════════╝
"""

# On-screen legend drawn into the frame
LEGEND_LINES = [
    ("GREEN = Correct Range", (0, 200, 0)),
    ("RED   = Needs Correction", (0, 50, 255)),
    ("WHITE = Angle Value", (200, 200, 200)),
]


# ─────────────────────────────────────────────────────────────────────────────
# Main System Class
# ─────────────────────────────────────────────────────────────────────────────
class MediaPipePhysiotherapySystem:
    """
    Production-ready MediaPipe physiotherapy system.
    """

    def __init__(self, exercise_name: str, model_complexity: int = 2):
        print(BANNER)
        print("=" * 79)
        print("  Initialising system...")
        print("=" * 79)

        # ── MediaPipe Pose setup ──────────────────────────────────────────────
        self.mp_pose    = mp.solutions.pose  # type: ignore

        print(f"\n  [·] Loading MediaPipe Pose (Complexity={model_complexity} - High Accuracy)")
        self.pose = self.mp_pose.Pose(  # type: ignore
            static_image_mode        = False,
            model_complexity         = model_complexity, # Enforced high accuracy
            smooth_landmarks         = True,
            enable_segmentation      = False,
            min_detection_confidence = 0.75, # Increased for accuracy
            min_tracking_confidence  = 0.75, # Increased for accuracy
        )
        print("  [✓] MediaPipe Pose loaded")

        # ── Analyzer ─────────────────────────────────────────────────────────
        self.analyzer = MediaPipePoseAnalyzer(
            tolerance_degrees   = 5,
            visibility_threshold = 0.60,
        )

        # ── Exercise setup ────────────────────────────────────────────────────
        self.exercise_name = exercise_name
        self.exercise_data = EXERCISE_STANDARDS.get(exercise_name)
        if not self.exercise_data:
            raise ValueError(f"Unknown exercise: '{exercise_name}'")

        print(f"  [✓] Exercise:    {exercise_name.replace('_', ' ').title()}")
        print(f"  [✓] Tolerance:   ±5° (Rehab Adjusted)")
        print(f"  [✓] Visibility:  Strict (0.60)")

        # Print description
        desc = self.exercise_data.get("description", "")
        if desc:
            print(f"\n  Description:\n    {desc}")

        # Print instructions
        instructions = self.exercise_data.get("instructions", [])
        if instructions:
            print("\n  Instructions:")
            for i, step in enumerate(instructions, 1):
                print(f"    {i}. {step}")

        # Print monitoring mode
        has_left  = "left"  in self.exercise_data
        has_right = "right" in self.exercise_data
        has_both  = "both"  in self.exercise_data
        
        print(f"\n  Monitoring:")
        if has_left: print("   - LEFT Side")
        if has_right: print("   - RIGHT Side")
        if has_both: print("   - BILATERAL (Both simultaneously)")

        print("\n" + "=" * 79)
        print("  CONTROLS:  SPACE = Pause/Resume  |  R = Reset stats  |  Q = Quit")
        print("  FEEDBACK:  Watch for ON-SCREEN ANGLES and TEXT CUES")
        print("=" * 79 + "\n")

        # FPS tracking
        self.fps_history = []
        self.last_time   = time.time()

    # ─────────────────────────────────────────────────────────────────────────
    # Frame Processing
    # ─────────────────────────────────────────────────────────────────────────
    def process_frame(self, frame: Any) -> Any:
        """
        Processes one BGR frame.
        """
        # Convert to RGB for MediaPipe
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # type: ignore
        rgb.flags.writeable = False  # type: ignore
        mp_results = self.pose.process(rgb)  # type: ignore
        rgb.flags.writeable = True  # type: ignore

        annotated = frame.copy()
        h, w = frame.shape[:2]

        if mp_results.pose_landmarks:  # type: ignore
            # ── Unpacked list  → angle math ───────────────────────────────────
            landmarks   = mp_results.pose_landmarks.landmark  # type: ignore
            vis_scores  = np.array([lm.visibility for lm in landmarks])  # type: ignore

            # ── Full object  → MediaPipe draw_landmarks() ────────────────────
            pose_landmarks = mp_results.pose_landmarks  # type: ignore

            # Analyse form
            analysis = self.analyzer.analyze_exercise(
                landmarks, vis_scores, self.exercise_data, w, h
            )

            # Draw skeleton + HUD
            annotated = self.analyzer.draw_feedback(
                annotated,
                analysis,
                pose_landmarks,
                self.exercise_name,
            )

        else:
            # No person detected overlay
            cv2.rectangle(annotated, (0, 0), (w, 115), (20, 20, 20), -1)  # type: ignore
            cv2.putText(annotated, "NO PERSON DETECTED",  # type: ignore
                        (20, 50), cv2.FONT_HERSHEY_DUPLEX, 0.9, (0, 50, 255), 2)
            cv2.putText(annotated, "Please step into typical webcam view range",  # type: ignore
                        (20, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180, 180, 180), 1)

        # ── FPS counter (bottom-right) ────────────────────────────
        now = time.time()
        fps = 1.0 / max(now - self.last_time, 1e-6)
        self.last_time = now
        self.fps_history.append(fps)
        if len(self.fps_history) > 30:
            self.fps_history.pop(0)
        avg_fps = sum(self.fps_history) / len(self.fps_history)

        cv2.putText(annotated, f"FPS: {avg_fps:.0f}",  # type: ignore
                    (w - 80, h - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 100, 100), 1)

        return annotated

    # ─────────────────────────────────────────────────────────────────────────
    # Webcam Loop
    # ─────────────────────────────────────────────────────────────────────────
    def run_webcam(self, camera_id: int = 0):
        """Opens webcam and runs the live monitoring loop."""
        cap = cv2.VideoCapture(camera_id)  # type: ignore
        if not cap.isOpened():
            raise RuntimeError(
                f"Cannot open camera {camera_id}. "
                "Check it is connected and not in use."
            )

        # Try to set reasonable resolution for performance vs accuracy
        cap.set(cv2.CAP_PROP_FRAME_WIDTH,  1280)  # type: ignore
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)  # type: ignore
        cap.set(cv2.CAP_PROP_FPS,          30)  # type: ignore

        # Confirm actual resolution
        actual_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))  # type: ignore
        actual_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))  # type: ignore
        print(f"  [✓] Camera opened: {actual_w}×{actual_h}\n")

        paused: bool           = False
        frame_errors: int      = 0
        MAX_ERRORS: int        = 10

        print("  [►] Monitoring started...\n")

        while True:
            if not paused:
                ret, frame = cap.read()

                if not ret:
                    frame_errors += 1  # type: ignore[operator]
                    print(f"  [!] Frame read error ({frame_errors}/{MAX_ERRORS})")
                    if frame_errors >= MAX_ERRORS:
                        print("  [✗] Too many errors — stopping.")
                        break
                    continue

                frame_errors = 0  # reset on success
                annotated    = self.process_frame(frame)
                
                # Show full screen if possible
                cv2.imshow("Physiotherapy Assistant", annotated)  # type: ignore

            # Keyboard controls
            key = cv2.waitKey(1 if not paused else 100) & 0xFF  # type: ignore

            if key == ord("q") or key == 27:   # Q or Esc
                print("\n  [·] Quit by user.")
                break
            elif key == ord(" "):
                paused = not paused
                print(f"  [{'■' if paused else '►'}] {'PAUSED' if paused else 'RESUMED'}")
            elif key == ord("r"):
                self.analyzer.reset_statistics()
                print("  [↺] Statistics reset.")

        cap.release()
        cv2.destroyAllWindows()  # type: ignore
        self.pose.close()  # type: ignore
        self._print_final_stats()

    # ─────────────────────────────────────────────────────────────────────────
    # Final Statistics
    # ─────────────────────────────────────────────────────────────────────────
    def _print_final_stats(self):
        """Prints session statistics to terminal on exit."""
        stats = self.analyzer.get_statistics()

        print("\n" + "=" * 79)
        print("  SESSION COMPLETE — FINAL STATISTICS")
        print("=" * 79)
        print(f"  Exercise   : {self.exercise_name.replace('_', ' ').title()}")
        print(f"  Overall    : {stats['overall_accuracy']:.1f}%  "
              f"({stats['total_frames']} frames)")

        print("\n  Great work today! Remember consistency is key to recovery.")
        print("=" * 79 + "\n")


# ─────────────────────────────────────────────────────────────────────────────
# Exercise Menu
# ─────────────────────────────────────────────────────────────────────────────
def display_menu() -> list:
    """Prints numbered exercise menu and returns ordered exercise list."""
    print("\n" + "=" * 79)
    print("                       SELECT YOUR REHAB EXERCISE")
    print("=" * 79)

    exercise_list: list  = []
    counter: int         = 1

    for category, exercises in EXERCISE_CATEGORIES.items():
        print(f"\n  {category.upper()}")
        print("  " + "─" * 75)
        for ex in exercises:
            if ex not in EXERCISE_STANDARDS:
                continue
            data       = EXERCISE_STANDARDS[ex]
            desc_short = data.get("description", "").split(".")[0]
            
            # Smart truncation for display
            if len(desc_short) > 45: desc_short = desc_short[:42] + "..."
            
            print(f"  [{counter:2d}]  {ex.replace('_', ' ').title():<30}  {desc_short}")
            exercise_list.append(ex)
            counter += 1  # type: ignore[operator]

    print("\n" + "=" * 79)
    print("  TIP: Ensure good lighting and wear contrasting clothes for best detection.")
    print("=" * 79 + "\n")
    return exercise_list


# ─────────────────────────────────────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print(BANNER)

    try:
        while True:
            exercise_list = display_menu()
            total         = len(exercise_list)

            choice = input(f"  Enter number (1–{total}) or 'q' to quit: ").strip()

            if choice.lower() in ("q", "quit", "exit"):
                print("\n  [✓] Goodbye — Wishing you a speedy recovery!\n")
                break

            # Validate numeric input
            try:
                idx = int(choice) - 1
            except ValueError:
                print(f"  [!] Type a number between 1 and {total}.\n")
                continue

            if not (0 <= idx < total):
                print(f"  [!] Number must be between 1 and {total}.\n")
                continue

            # Run with forced high accuracy (Complexity=2)
            try:
                print("\n  [·] Initializing High-Precision Mode...")
                system = MediaPipePhysiotherapySystem(
                    exercise_name   = exercise_list[idx],
                    model_complexity = 2, 
                )
                system.run_webcam(camera_id=0)

            except RuntimeError as e:
                print(f"\n  [✗] Camera Configuration Error: {e}\n")
                fallback = input("  Try alternate camera? (y/n): ").strip().lower()
                if fallback == "y":
                    try:
                        system.run_webcam(camera_id=1)
                    except Exception as e2:
                        print(f"  [✗] Fallback failed: {e2}")

            except Exception as e:
                print(f"\n  [✗] Unexpected error: {e}")
                import traceback
                traceback.print_exc()

            # Continue prompt
            again = input("\n  Do another exercise? (y/n): ").strip().lower()
            if again != "y":
                print("\n  [✓] Session closed.\n")
                break

    except KeyboardInterrupt:
        print("\n\n  [!] Interrupted with Ctrl+C. Bye!\n")
        sys.exit(0)


if __name__ == "__main__":
    main()

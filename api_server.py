import cv2 # type: ignore
import threading
import time
import asyncio
import sys
import uvicorn # type: ignore
from typing import Any, Optional
from fastapi import FastAPI, BackgroundTasks, Request # type: ignore
from fastapi.responses import StreamingResponse # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

from pydantic import BaseModel # type: ignore
from main_flex import FlexSystem # type: ignore
from state_manager import SystemMode # type: ignore
from angle_utils import is_full_body_visible # type: ignore

app = FastAPI()

class SpeakRequest(BaseModel):
    text: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GlobalState:
    def __init__(self):
        self.system: Any = None
        self.is_running: bool = False
        self.current_frame: Optional[bytes] = None
        self.current_conn_id: int = 0
        self.lock = threading.Lock()

global_state = GlobalState()

def engine_loop(exercise_name: str, user_name: str = "User"):
    print(f"[API] Starting engine loop for {exercise_name} (user: {user_name})")
    try:
        global_state.system = FlexSystem(exercise_name, user_name=user_name)
    except Exception as e:
        print(f"[API] Failed to init FlexSystem: {e}")
        global_state.is_running = False
        return
        
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    global_state.system.state.set_mode(SystemMode.IDLE)
    
    try:
        while global_state.is_running:
            ret, frame = cap.read()
            if not ret:
                time.sleep(0.01)
                continue
                
            annotated = frame.copy()
            results = global_state.system.detector.process_frame(frame)
            landmarks, vis_scores = global_state.system.detector.extract_landmarks(results)
            
            mode = global_state.system.state.current_mode
            
            # ── Legacy Visual HUD & Skeleton Overlay ──
            if results and results.pose_landmarks and landmarks is not None:
                vis_analysis = global_state.system.visual_analyzer.analyze_exercise(
                    landmarks, vis_scores, global_state.system.visual_config, w, h
                )
                annotated = global_state.system.visual_analyzer.draw_feedback(
                    annotated, vis_analysis, results.pose_landmarks, global_state.system.exercise_name
                )

            # ── System Mode HUD ──
            cv2.putText(annotated, f"MODE: {mode.name}", (w - 300, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

            if landmarks is not None:
                # ── Universal Telemetry Tracking ──
                if mode in [SystemMode.ACTIVE_COACHING, SystemMode.LISTENING, SystemMode.SPEAKING]:
                    global_state.system.latest_context = global_state.system.feedback.evaluate_frame(landmarks, vis_scores, global_state.system.config, w, h)
                    
                # ── State Machine Logic ──
                if mode == SystemMode.IDLE:
                    if is_full_body_visible(landmarks, vis_scores):
                        global_state.system.state.set_mode(SystemMode.BODY_DETECTED)
                        global_state.system.body_detected_time = time.time()

                elif mode == SystemMode.BODY_DETECTED:
                    if time.time() - global_state.system.body_detected_time > 2.0:
                        if is_full_body_visible(landmarks, vis_scores):
                            global_state.system.voice.speak("Great, I can see you clearly.")
                            global_state.system.state.set_mode(SystemMode.STARTING_EXERCISE)
                            
                            intro_text = global_state.system.config.get("intro", ["Let's begin."])[0]
                            global_state.system.voice.speak(intro_text)
                            global_state.system.exercise_start_time = time.time()
                        else:
                            global_state.system.state.set_mode(SystemMode.IDLE)

                elif mode == SystemMode.STARTING_EXERCISE:
                    cv2.putText(annotated, "GET READY", (15, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 255, 255), 2)
                    if not global_state.system.voice.is_playing and (time.time() - global_state.system.exercise_start_time > 2.0):
                        global_state.system.state.set_mode(SystemMode.ACTIVE_COACHING)

                elif mode == SystemMode.ACTIVE_COACHING:
                    if not global_state.system.voice.is_playing and not global_state.system.state.is_ai_active():
                        cue_or_error, escalate = global_state.system.feedback.get_coaching_cue(global_state.system.latest_context)
                        
                        if escalate:
                            global_state.system._trigger_escalation()
                        elif cue_or_error:
                            if isinstance(cue_or_error, dict):
                                threading.Thread(target=global_state.system._run_ai_live_cue, args=(cue_or_error, global_state.system.latest_context), daemon=True).start()
                            else:
                                global_state.system.voice.speak(cue_or_error)

                elif mode == SystemMode.LISTENING:
                    cv2.putText(annotated, "LISTENING TO YOU...", (w // 2 - 180, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 255, 0), 2)

                elif mode == SystemMode.SPEAKING:
                    cv2.putText(annotated, "AI SPEAKING...", (w // 2 - 150, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 0, 255), 2)

            else:
                cv2.putText(annotated, "NO PERSON DETECTED", (w // 2 - 150, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 0, 255), 2)
                if not global_state.system.state.is_ai_active():
                    global_state.system.state.set_mode(SystemMode.IDLE)
                    
            # ── Global Out-Of-Bounds Prompt ──
            _is_out_of_bounds = (landmarks is None) or (not is_full_body_visible(landmarks, vis_scores))
            if global_state.system.state.current_mode == SystemMode.IDLE and _is_out_of_bounds:
                if time.time() - getattr(global_state.system, 'init_time', 0) > 4.0:
                    if time.time() - getattr(global_state.system, 'last_idle_prompt', 0) > 10.0 and not global_state.system.voice.is_playing:
                        global_state.system.voice.speak("I cannot see your full body. Please step back into the camera frame.")
                        global_state.system.last_idle_prompt = time.time()
                cv2.putText(annotated, "PLEASE STEP BACK", (15, 90), cv2.FONT_HERSHEY_DUPLEX, 1.0, (0, 0, 255), 2)

            ret, buffer = cv2.imencode('.jpg', annotated)
            if ret:
                with global_state.lock:
                    global_state.current_frame = buffer.tobytes()
                    
            time.sleep(0.01)
            
    finally:
        print("[API] Cleaning up engine...")
        if global_state.system:
            global_state.system.wake_word.stop()
            global_state.system.voice.stop()
            global_state.system.detector.close()
        cap.release()
        global_state.system = None

async def generate_stream(request: Request, conn_id: int):
    while True:
        if await request.is_disconnected():
            print(f"[API] Client {conn_id} disconnected.")
            if getattr(global_state, 'current_conn_id', -1) == conn_id:
                print("[API] Active client disconnected, stopping engine.")
                global_state.is_running = False
                if global_state.system:
                    try:
                        global_state.system.voice.stop()
                    except:
                        pass
            break
            
        with global_state.lock:
            frame = global_state.current_frame
            
        if frame:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            await asyncio.sleep(0.03) # Cap at ~30 FPS
        else:
            await asyncio.sleep(0.1)

@app.get("/video_feed")
async def video_feed(request: Request, exercise: str = "standing_sky_reach", user_name: str = "User"):
    global_state.is_running = False
    if global_state.system:
        try:
            global_state.system.voice.stop()
        except:
            pass
            
    await asyncio.sleep(0.5) # Wait for thread to stop
    
    global_state.current_conn_id = getattr(global_state, 'current_conn_id', 0) + 1
    
    global_state.is_running = True
    threading.Thread(target=engine_loop, args=(exercise, user_name), daemon=True).start()
    
    return StreamingResponse(generate_stream(request, global_state.current_conn_id), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/metrics")
def get_metrics():
    if not global_state.is_running or not global_state.system:
        return {"reps": 0, "accuracy": 0, "status": "WAITING", "is_running": False}
        
    va: Any = getattr(global_state.system, 'visual_analyzer', None)
    
    reps = getattr(va, 'rep_count', 0) if va else 0
    
    accuracy = 0
    if va and getattr(va, 'frame_count', 0) > 0:
        accuracy = min((getattr(va, 'correct_frames', 0) / getattr(va, 'frame_count', 1)) * 100, 100.0)
    
    context = getattr(global_state.system, 'latest_context', {})
    errors = context.get('errors', [])
    
    status = "READY"
    if va and getattr(va, 'frame_count', 0) > 10:
        if len(errors) == 0:
            status = "PERFECT"
        elif len(errors) == 1:
            status = "GOOD"
        else:
            status = "NEEDS WORK"
            
    return {
        "reps": reps,
        "accuracy": accuracy,
        "status": status,
        "mode": global_state.system.state.current_mode.name if global_state.system else "IDLE",
        "is_running": True
    }

@app.post("/speak")
def speak(req: SpeakRequest):
    if global_state.system and global_state.is_running:
        try:
            global_state.system.voice.speak(req.text)
            return {"status": "ok"}
        except Exception as e:
            print(f"[API] Speak Error: {e}")
            return {"status": "error", "message": str(e)}
    return {"status": "offline"}

@app.get("/stop")
def stop():
    global_state.is_running = False
    if global_state.system:
        try:
            global_state.system.voice.stop()
        except:
            pass
    return {"status": "stopped"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

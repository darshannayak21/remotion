import time
import random
from typing import Any, Dict, List, Optional, Tuple, Union
from angle_utils import calculate_angle, validate_landmarks  # type: ignore

class FeedbackEngine:
    """
    Evaluates current posture against exercise config.
    Applies temporal smoothing to prevent flutter/spam.
    Tracks repetitions of errors to trigger AI escalation.
    """
    def __init__(self, persistence_time: float = 0.8, cooldown_time: float = 4.0, allow_interruptions: bool = True) -> None:
        # Configuration
        self.persistence_time = persistence_time
        self.cooldown_time = cooldown_time
        self.allow_interruptions = allow_interruptions
        
        # State tracking
        self.error_start_times: Dict[str, float] = {}  # Track when an error currently started
        self.last_spoken_time: float = 0.0
        self.last_positive_time: float = 0.0  # Track when we last gave praise
        self.positive_cooldown: float = 12.0  # Wait 12 seconds between praising perfect form
        
        # Escalation tracking
        self.error_speak_counts: Dict[str, List[float]] = {}  # joint_name -> list of timestamps it was spoken
        
    def evaluate_frame(
        self,
        landmarks: Any,
        vis_scores: Any,
        exercise_data: Dict[str, Any],
        width: int,
        height: int
    ) -> Dict[str, Any]:
        """
        Calculates angles for all keypoints defined in the exercise.
        Returns a structured dictionary of the current posture context.
        """
        import numpy as np  # type: ignore
        
        context: Dict[str, Any] = {
            "errors": [],
            "joints": {}
        }
        
        sides_to_check: List[Tuple[str, Any]] = []
        if "left" in exercise_data: sides_to_check.append(("left", exercise_data["left"]))
        if "right" in exercise_data: sides_to_check.append(("right", exercise_data["right"]))
        if "both" in exercise_data: sides_to_check.append(("both", exercise_data["both"]))
            
        for side_name, side_data in sides_to_check:
            for joint_name, param in side_data.items():
                ideal_min, ideal_max = param["ideal_range"]
                indices = param["keypoints"]
                
                valid, _ = validate_landmarks(
                    landmarks, vis_scores, indices, width=width, height=height
                )
                if not valid:
                    continue
                    
                p0 = np.array([landmarks[indices[0]].x * width, landmarks[indices[0]].y * height])  # type: ignore[call-overload]
                p1 = np.array([landmarks[indices[1]].x * width, landmarks[indices[1]].y * height])  # type: ignore[call-overload]
                p2 = np.array([landmarks[indices[2]].x * width, landmarks[indices[2]].y * height])  # type: ignore[call-overload]
                
                angle = calculate_angle(p0, p1, p2)
                if angle is None:
                    continue
                    
                is_correct = (ideal_min - 5) <= angle <= (ideal_max + 5)
                
                context["joints"][joint_name] = {  # type: ignore[index]
                    "angle": round(angle, 1),
                    "ideal_range": [ideal_min, ideal_max],
                    "is_correct": is_correct
                }
                
                if not is_correct:
                    context["errors"].append({  # type: ignore[union-attr]
                        "joint": joint_name,
                        "cues": param.get("cues", ["Adjust your position."])
                    })
                    
        return context

    def get_coaching_cue(self, context: Dict[str, Any]) -> Tuple[Union[str, Dict[str, Any]], bool]:
        """
        Applies temporal logic to determine if we should speak right now.
        Returns (Cue_Text_To_Speak, Boolean_Should_Escalate)
        
        For rep-based exercises (allow_interruptions=False):
          - 10-second escalation STILL fires (AI explains what's wrong)
          - Short coaching cues and positive reinforcement are SKIPPED
        For hold-based exercises (allow_interruptions=True):
          - Full behavior: short cues + escalation + positive reinforcement
        """
        current_time = time.time()
        
        active_error_joints: List[str] = [e["joint"] for e in context["errors"]]
        
        # Clean up stale errors from history
        keys_to_remove = [k for k in self.error_start_times if k not in active_error_joints]
        for k in keys_to_remove:
            self.error_start_times.pop(k, None)

        # Register new errors
        for err in context["errors"]:
            j = err["joint"]
            if j not in self.error_start_times:
                self.error_start_times[j] = current_time
                
        # Are we in global cooldown?
        if current_time - self.last_spoken_time < self.cooldown_time:
            return "", False

        # ── 10-Second Escalation (ALWAYS active, both rep and hold exercises) ──
        for err in context["errors"]:
            j = err["joint"]
            if j not in self.error_start_times:
                continue
            duration = current_time - self.error_start_times[j]
            time_since_last_speech = current_time - self.last_spoken_time
            
            if duration >= 10.0 and time_since_last_speech >= 10.0:
                print(f"[Feedback] User inactive/incorrect for 10s on {j}. Escalating to full AI explanation.")
                # Reset timing blocks to guarantee at least 10 seconds before the next major explanation
                self.error_start_times.clear()
                self.error_speak_counts.clear()
                self.last_spoken_time = current_time
                return dict(err), True  # Force full AI Escalation

        # ── Everything below is ONLY for hold-based exercises (allow_interruptions=True) ──
        if not self.allow_interruptions:
            return "", False

        # Positive Reinforcement: If there are absolutely zero errors right now
        if not context["errors"] and context["joints"]:
            # Only praise occasionally to avoid spam
            if current_time - self.last_positive_time > self.positive_cooldown:
                self.last_positive_time = current_time
                self.last_spoken_time = current_time
                praise_cues = [
                    "Perfect form right now, keep it up!",
                    "Excellent posture, your angles are spot on.",
                    "You're doing that flawlessly, great job.",
                    "Really good alignment there, keep holding that form."
                ]
                return random.choice(praise_cues), False

        # Find the most persistent error that has exceeded persistence_time
        longest_error: Optional[Dict[str, Any]] = None
        longest_dist: float = 0.0
        
        for err in context["errors"]:
            j = err["joint"]
            if j not in self.error_start_times:
                continue
            duration = current_time - self.error_start_times[j]

            if duration >= self.persistence_time:
                if duration > longest_dist:
                    longest_dist = duration
                    longest_error = err

        if longest_error:
            j = longest_error["joint"]  # type: ignore[index]
            
            # Record that we are speaking about this error
            if j not in self.error_speak_counts:
                self.error_speak_counts[j] = []
            self.error_speak_counts[j].append(current_time)
            
            # Clean up old speaks outside the 10-second window
            self.error_speak_counts[j] = [t for t in self.error_speak_counts[j] if current_time - t <= 10.0]
            
            # Provide standard short coaching instruction
            self.last_spoken_time = current_time
            return dict(longest_error), False  # type: ignore[return-value]

        return "", False


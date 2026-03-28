"""
PRODUCTION-LEVEL MediaPipe Pose Analyzer
Uses MediaPipe's native draw_landmarks() with DrawingSpec for accurate bilateral coloring
All 33 landmarks | Per-connection color control | Strict bilateral form analysis
"""

import numpy as np
import cv2
from typing import Dict, Optional, Tuple
import mediapipe as mp

# ─────────────────────────────────────────────────────────────────────────────
# Landmark Side Classification (MediaPipe 33-point model)
# ─────────────────────────────────────────────────────────────────────────────
LEFT_BODY_LANDMARKS = {
    11,  # left_shoulder
    13,  # left_elbow
    15,  # left_wrist
    17,  # left_pinky
    19,  # left_index
    21,  # left_thumb
    23,  # left_hip
    25,  # left_knee
    27,  # left_ankle
    29,  # left_heel
    31,  # left_foot_index
}

RIGHT_BODY_LANDMARKS = {
    12,  # right_shoulder
    14,  # right_elbow
    16,  # right_wrist
    18,  # right_pinky
    20,  # right_index
    22,  # right_thumb
    24,  # right_hip
    26,  # right_knee
    28,  # right_ankle
    30,  # right_heel
    32,  # right_foot_index
}

# Face / center landmarks (no side distinction needed)
CENTER_LANDMARKS = set(range(0, 11))  # 0-10: nose, eyes, ears, mouth

# ─────────────────────────────────────────────────────────────────────────────
# Color palette (BGR)
# ─────────────────────────────────────────────────────────────────────────────
COLOR_LEFT_CORRECT   = (0, 230, 0)     # GREEN  - left side correct
COLOR_LEFT_WRONG     = (0, 0, 255)     # RED    - left side incorrect
COLOR_RIGHT_CORRECT  = (0, 230, 0)     # GREEN  - right side correct
COLOR_RIGHT_WRONG    = (0, 0, 255)     # RED    - right side incorrect
COLOR_CENTER         = (160, 160, 160) # GRAY   - face / center
COLOR_WHITE          = (255, 255, 255) # WHITE  - landmark outline


class MediaPipePoseAnalyzer:
    """
    Production-level analyzer using MediaPipe's native drawing API.
    - draw_landmarks() with per-connection DrawingSpec for accurate bilateral colors
    - Strict 5° angle tolerance
    - Real-time accuracy percentages (Left %, Right %, Overall %)
    - Both sides always monitored: RED = wrong, GREEN = correct
    """

    def __init__(self, tolerance_degrees: int = 5, visibility_threshold: float = 0.65):
        self.tolerance           = tolerance_degrees
        self.visibility_threshold = visibility_threshold
        self.min_px_distance     = 8.0

        # Cumulative session stats
        self.frame_count   = 0
        self.correct_frames = 0
        self.left_stats    = {"correct": 0, "total": 0}
        self.right_stats   = {"correct": 0, "total": 0}
        
        # Rep Tracking & Hysteresis
        self.rep_count = 0
        self.is_in_rep_zone = False

    # ─────────────────────────────────────────────────────────────────────────
    # Core Angle Math
    # ─────────────────────────────────────────────────────────────────────────

    def calculate_angle(self, p1: np.ndarray, p2: np.ndarray,
                        p3: np.ndarray) -> Optional[float]:
        """Angle (degrees) at vertex p2 formed by rays p2→p1 and p2→p3."""
        ba = p1 - p2
        bc = p3 - p2

        ba_n = np.linalg.norm(ba)
        bc_n = np.linalg.norm(bc)

        if ba_n < self.min_px_distance or bc_n < self.min_px_distance:
            return None

        cos_a = np.clip(np.dot(ba, bc) / (ba_n * bc_n), -1.0, 1.0)
        angle = np.degrees(np.arccos(cos_a))

        return angle if 0.0 <= angle <= 180.0 else None

    # ─────────────────────────────────────────────────────────────────────────
    # Landmark Validation
    # ─────────────────────────────────────────────────────────────────────────

    def _validate(self, landmarks, vis: np.ndarray,
                  indices: Tuple[int, int, int]) -> Tuple[bool, str]:
        """Return (is_valid, reason_string)."""
        for idx in indices:
            if idx >= len(landmarks):
                return False, f"lm {idx} missing"
            if vis[idx] < self.visibility_threshold:
                return False, f"lm {idx} low vis ({vis[idx]:.2f})"
            lm = landmarks[idx]
            if not (0.0 <= lm.x <= 1.0 and 0.0 <= lm.y <= 1.0):
                return False, f"lm {idx} off-screen"

        # Pixel distance check
        def px(i):
            return np.array([landmarks[i].x * 640, landmarks[i].y * 480])

        if np.linalg.norm(px(indices[0]) - px(indices[1])) < self.min_px_distance:
            return False, "landmarks too close (01)"
        if np.linalg.norm(px(indices[1]) - px(indices[2])) < self.min_px_distance:
            return False, "landmarks too close (12)"

        return True, "ok"

    # ─────────────────────────────────────────────────────────────────────────
    # Per-side Analysis
    # ─────────────────────────────────────────────────────────────────────────

    def _analyze_side(self, landmarks, vis: np.ndarray,
                      side_standards: Dict, side_label: str,
                      W: int, H: int) -> Tuple[Dict, bool, bool]:
        """
        Returns (joint_results, all_correct, any_valid).
        joint_results keys are joint names; each value carries angle, correctness, etc.
        """
        joint_results = {}
        all_correct   = True
        any_valid     = False

        for joint_name, std in side_standards.items():
            lo, hi   = std["ideal_range"]
            idx_trio = std["keypoints"]

            valid, reason = self._validate(landmarks, vis, idx_trio)

            if not valid:
                joint_results[joint_name] = {
                    "visible": False, "angle": None,
                    "is_correct": False, "feedback": f"{joint_name}: {reason}",
                    "severity": 999, "side": side_label,
                    "landmark_indices": idx_trio
                }
                all_correct = False
                continue

            p = [np.array([landmarks[i].x * W, landmarks[i].y * H]) for i in idx_trio]
            angle = self.calculate_angle(p[0], p[1], p[2])

            if angle is None:
                joint_results[joint_name] = {
                    "visible": False, "angle": None,
                    "is_correct": False, "feedback": f"{joint_name}: bad geometry",
                    "severity": 999, "side": side_label,
                    "landmark_indices": idx_trio
                }
                all_correct = False
                continue

            any_valid    = True
            is_correct   = (lo - self.tolerance) <= angle <= (hi + self.tolerance)
            deviation    = abs(angle - (lo + hi) / 2)

            # Continuous Interpolation for Form Tracking
            if is_correct:
                score_pct = 100.0
            else:
                # Calculate distance from the edge of the allowed boundary
                dist = min(abs(angle - lo), abs(angle - hi))
                # 90 degrees away constitutes 0% progress
                score_pct = max(0.0, 100.0 * (1.0 - (dist / 90.0)))

            joint_results[joint_name] = {
                "visible": True,
                "angle": angle,
                "ideal_range": (lo, hi),
                "is_correct": is_correct,
                "score_pct": score_pct,
                "feedback": std["feedback"].format(angle=angle),
                "severity": deviation,
                "side": side_label,
                "landmark_indices": idx_trio
            }

            if not is_correct:
                all_correct = False

        return joint_results, (all_correct and any_valid), any_valid

    # ─────────────────────────────────────────────────────────────────────────
    # Main Exercise Analysis Entry Point
    # ─────────────────────────────────────────────────────────────────────────

    def analyze_exercise(self, landmarks, vis: np.ndarray,
                         exercise_data: Dict, W: int, H: int) -> Dict:
        """
        Analyzes left, right, and/or both sides.
        Returns full results dict including accuracy_percentage.
        """
        results = {
            "left_side": {}, "right_side": {}, "both_sides": {},
            "overall_correct": False,
            "sides_status": {"left": None, "right": None, "both": None},
            "has_valid_measurements": False,
            "accuracy_percentage": 0.0
        }

        required = valid = 0
        all_ok   = True

        # ── LEFT ──
        if "left" in exercise_data:
            required += 1
            jr, ok, has = self._analyze_side(
                landmarks, vis, exercise_data["left"], "LEFT", W, H)
            results["left_side"] = jr
            if has:
                valid += 1
                self.left_stats["total"] += 1
                results["sides_status"]["left"] = ok
                if ok:
                    self.left_stats["correct"] += 1
                else:
                    all_ok = False
            else:
                results["sides_status"]["left"] = False
                all_ok = False

        # ── RIGHT ──
        if "right" in exercise_data:
            required += 1
            jr, ok, has = self._analyze_side(
                landmarks, vis, exercise_data["right"], "RIGHT", W, H)
            results["right_side"] = jr
            if has:
                valid += 1
                self.right_stats["total"] += 1
                results["sides_status"]["right"] = ok
                if ok:
                    self.right_stats["correct"] += 1
                else:
                    all_ok = False
            else:
                results["sides_status"]["right"] = False
                all_ok = False

        # ── BOTH ──
        if "both" in exercise_data:
            required += 1
            jr, ok, has = self._analyze_side(
                landmarks, vis, exercise_data["both"], "BOTH", W, H)
            results["both_sides"] = jr
            if has:
                valid += 1
                results["sides_status"]["both"] = ok
                if not ok:
                    all_ok = False
            else:
                results["sides_status"]["both"] = False
                all_ok = False

        # ── Accuracy % (per-frame, based on visible joints) ──
        all_joints = (
            list(results["left_side"].values()) +
            list(results["right_side"].values()) +
            list(results["both_sides"].values())
        )
        visible = [j for j in all_joints if j.get("visible")]
        if visible:
            correct = [j for j in visible if j.get("is_correct")]
            results["accuracy_percentage"] = len(correct) / len(visible) * 100.0
            
            # Extract smooth percentage explicitly separated by true human side
            def extract_side_score(joints: list, side_set: set) -> Optional[float]:
                side_joints = [j["score_pct"] for j in joints if j.get("visible") and "score_pct" in j and 
                               any(idx in side_set for idx in j.get("landmark_indices", []))]
                return sum(side_joints) / len(side_joints) if side_joints else None

            l_prog = extract_side_score(all_joints, LEFT_BODY_LANDMARKS)
            r_prog = extract_side_score(all_joints, RIGHT_BODY_LANDMARKS)
            
            results["left_progress"] = l_prog
            results["right_progress"] = r_prog
            if l_prog is None and r_prog is None:
                # Fallback center joint exercise
                results["center_progress"] = sum(j["score_pct"] for j in visible if "score_pct" in j) / len(visible)
                
            # ── Hysteresis Rep Counter Logic ──
            prog_vals = [p for p in [results.get("left_progress"), results.get("right_progress"), results.get("center_progress")] if p is not None]
            avg_progress = sum(prog_vals) / len(prog_vals) if prog_vals else 0.0

            if avg_progress >= 95.0 and not self.is_in_rep_zone:
                self.rep_count += 1
                self.is_in_rep_zone = True
            elif avg_progress <= 40.0:
                self.is_in_rep_zone = False

        results["has_valid_measurements"] = valid > 0
        results["overall_correct"]        = all_ok and (valid == required)

        self.frame_count += 1
        if results["overall_correct"]:
            self.correct_frames += 1

        return results

    # ─────────────────────────────────────────────────────────────────────────
    # Statistics
    # ─────────────────────────────────────────────────────────────────────────

    def get_statistics(self) -> Dict:
        def pct(n, d):
            return n / d * 100 if d > 0 else 0.0

        return {
            "overall_accuracy": pct(self.correct_frames, self.frame_count),
            "total_frames":     self.frame_count,
            "correct_frames":   self.correct_frames,
            "left_accuracy":    pct(self.left_stats["correct"],  self.left_stats["total"]),
            "left_correct":     self.left_stats["correct"],
            "left_total":       self.left_stats["total"],
            "right_accuracy":   pct(self.right_stats["correct"], self.right_stats["total"]),
            "right_correct":    self.right_stats["correct"],
            "right_total":      self.right_stats["total"],
        }

    def reset_statistics(self):
        self.frame_count    = 0
        self.correct_frames = 0
        self.left_stats     = {"correct": 0, "total": 0}
        self.right_stats    = {"correct": 0, "total": 0}
        self.rep_count = 0
        self.is_in_rep_zone = False

    # ─────────────────────────────────────────────────────────────────────────
    # MediaPipe Native DrawingSpec Builder
    # ─────────────────────────────────────────────────────────────────────────

    def _build_drawing_specs(self, joint_results: Dict):
        """
        Builds per-landmark and per-connection DrawingSpec dicts using
        MediaPipe's native API.  Returns (landmark_spec_dict, connection_spec_dict).

        Color logic:
          GREEN  = joint is visible AND within target range
          RED    = joint is visible AND outside target range  (or invisible)
          GRAY   = face/center landmark
        """
        mp_drawing = mp.solutions.drawing_utils
        mp_pose    = mp.solutions.pose

        # Collect which landmarks are incorrect per side
        left_wrong  = set()
        right_wrong = set()

        for res in joint_results.values():
            if not res.get("is_correct", True):
                indices = res.get("landmark_indices", [])
                side    = res.get("side", "")
                for i in indices:
                    if side == "LEFT":
                        left_wrong.add(i)
                    elif side == "RIGHT":
                        right_wrong.add(i)
                    else:  # BOTH
                        left_wrong.add(i)
                        right_wrong.add(i)

        # ── Per-landmark specs ──────────────────────────────────────────────
        lm_spec = {}
        for idx in range(33):
            if idx in CENTER_LANDMARKS:
                color = COLOR_CENTER
            elif idx in LEFT_BODY_LANDMARKS:
                color = COLOR_LEFT_WRONG if idx in left_wrong else COLOR_LEFT_CORRECT
            elif idx in RIGHT_BODY_LANDMARKS:
                color = COLOR_RIGHT_WRONG if idx in right_wrong else COLOR_RIGHT_CORRECT
            else:
                color = COLOR_CENTER

            lm_spec[idx] = mp_drawing.DrawingSpec(
                color=color, thickness=-1, circle_radius=6
            )

        # ── Per-connection specs ────────────────────────────────────────────
        conn_spec = {}
        for conn in mp_pose.POSE_CONNECTIONS:
            s, e = conn[0], conn[1]

            s_left  = s in LEFT_BODY_LANDMARKS
            s_right = s in RIGHT_BODY_LANDMARKS
            e_left  = e in LEFT_BODY_LANDMARKS
            e_right = e in RIGHT_BODY_LANDMARKS

            if s_left or e_left:
                # Left-side connection
                wrong = (s in left_wrong) or (e in left_wrong)
                color = COLOR_LEFT_WRONG if wrong else COLOR_LEFT_CORRECT
                thick = 3
            elif s_right or e_right:
                # Right-side connection
                wrong = (s in right_wrong) or (e in right_wrong)
                color = COLOR_RIGHT_WRONG if wrong else COLOR_RIGHT_CORRECT
                thick = 3
            else:
                # Center / face connections
                color = COLOR_CENTER
                thick = 2

            conn_spec[conn] = mp_drawing.DrawingSpec(color=color, thickness=thick)

        return lm_spec, conn_spec

    def _draw_vertical_bar(self, frame: np.ndarray, x: int, y: int, bar_w: int, bar_h: int, pct: float, label: str):
        """Draws a premium vertical progress bar with Red->Yellow->Green color scaling."""
        cv2.rectangle(frame, (x, y), (x + bar_w, y + bar_h), (40, 40, 40), -1)
        cv2.rectangle(frame, (x, y), (x + bar_w, y + bar_h), (200, 200, 200), 1)

        if pct < 50:
            r, g, b = 255, int((pct / 50.0) * 200), 0
        else:
            ratio = (pct - 50.0) / 50.0
            r, g, b = int(255 * (1.0 - ratio)), int(200 + (30 * ratio)), 0
            
        fill_color = (b, g, r)

        fill_h = int((pct / 100.0) * bar_h)
        if fill_h > 0:
            cv2.rectangle(frame, (x, y + bar_h - fill_h), (x + bar_w, y + bar_h), fill_color, -1)

        text_y = y + bar_h + 30
        font = cv2.FONT_HERSHEY_DUPLEX
        pct_text = f"{int(pct)}%"
        ts_size = cv2.getTextSize(pct_text, font, 0.7, 2)[0]
        tx = x + (bar_w - ts_size[0]) // 2
        
        cv2.putText(frame, pct_text, (tx, text_y), font, 0.7, (0, 0, 0), 3)
        cv2.putText(frame, pct_text, (tx, text_y), font, 0.7, fill_color, 2)
        
        ts_size_l = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
        lx = x + (bar_w - ts_size_l[0]) // 2
        cv2.putText(frame, label, (lx, text_y + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    # ─────────────────────────────────────────────────────────────────────────
    # HUD Overlay
    # ─────────────────────────────────────────────────────────────────────────

    def _draw_hud(self, frame: np.ndarray, results: Dict, exercise_name: str):
        """Draws header, accuracy%, side percentages, and correction cues."""
        h, w = frame.shape[:2]

        accuracy = results.get("accuracy_percentage", 0.0)

        # Status label + color
        if accuracy >= 95:
            s_color, s_label = (0, 230, 0),   "PERFECT"
        elif accuracy >= 85:
            s_color, s_label = (0, 230, 0),   "EXCELLENT"
        elif accuracy >= 70:
            s_color, s_label = (0, 210, 160), "GOOD"
        elif accuracy >= 50:
            s_color, s_label = (0, 160, 255), "FAIR"
        else:
            s_color, s_label = (0, 60, 255),  "NEEDS WORK"

        # ── Header bar ──────────────────────────────────────────────────────
        cv2.rectangle(frame, (0, 0), (w, 78), (25, 25, 25), -1)

        ex_title = exercise_name.replace("_", " ").title()[:38]
        cv2.putText(frame, ex_title, (12, 30),
                    cv2.FONT_HERSHEY_DUPLEX, 0.70, (255, 255, 255), 2)

        cv2.putText(frame, f"{s_label}  {accuracy:.0f}%", (12, 63),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.80, s_color, 2)

        # ── Vertical Progress Bars ───────────────────────────────────────────
        l_prog = results.get("left_progress")
        r_prog = results.get("right_progress")
        c_prog = results.get("center_progress")

        v_bar_w = 32
        v_bar_h = min(350, int(h * 0.50))
        v_bar_y = int((h - v_bar_h) / 2) + 20

        if l_prog is not None and r_prog is not None:
            self._draw_vertical_bar(frame, 30, v_bar_y, v_bar_w, v_bar_h, l_prog, "L")
            self._draw_vertical_bar(frame, w - 62, v_bar_y, v_bar_w, v_bar_h, r_prog, "R")
        elif l_prog is not None:
            self._draw_vertical_bar(frame, 30, v_bar_y, v_bar_w, v_bar_h, l_prog, "L")
        elif r_prog is not None:
            self._draw_vertical_bar(frame, w - 62, v_bar_y, v_bar_w, v_bar_h, r_prog, "R")
        elif c_prog is not None:
            self._draw_vertical_bar(frame, w - 62, v_bar_y, v_bar_w, v_bar_h, c_prog, "FORM")

        # ── Side % panels (top-right) ────────────────────────────────────────
        stats  = self.get_statistics()
        panel_x = w - 145
        panel_y = 10

        def side_color(pct):
            if pct >= 75: return (0, 230, 0)
            if pct >= 50: return (0, 160, 255)
            return (0, 60, 255)

        if stats["left_total"] > 0:
            lp = stats["left_accuracy"]
            cv2.putText(frame, f"L: {lp:.0f}%", (panel_x, panel_y + 18),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, side_color(lp), 2)
            panel_y += 30

        if stats["right_total"] > 0:
            rp = stats["right_accuracy"]
            cv2.putText(frame, f"R: {rp:.0f}%", (panel_x, panel_y + 18),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, side_color(rp), 2)

        # ── Rep Counter Panel (Bottom-Left) ──────────────────────────────────
        rep_box_x, rep_box_y = 12, h - 150
        cv2.rectangle(frame, (rep_box_x, rep_box_y), (rep_box_x + 140, rep_box_y + 55), (35, 35, 35), -1)
        cv2.rectangle(frame, (rep_box_x, rep_box_y), (rep_box_x + 140, rep_box_y + 55), (100, 200, 255), 2)
        cv2.putText(frame, "REPS", (rep_box_x + 12, rep_box_y + 24), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (180, 180, 180), 2)
        
        # Center-align rep count numerically
        rep_text = str(self.rep_count)
        tw = cv2.getTextSize(rep_text, cv2.FONT_HERSHEY_DUPLEX, 1.4, 3)[0][0]
        tx = rep_box_x + (140 - tw) // 2
        cv2.putText(frame, rep_text, (tx, rep_box_y + 45), cv2.FONT_HERSHEY_DUPLEX, 1.4, (100, 200, 255), 3)

        # ── Session overall (small) ──────────────────────────────────────────
        ov = stats["overall_accuracy"]
        cv2.putText(frame, f"Session: {ov:.0f}%", (12, h - 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.48, (200, 200, 200), 1)

        # ── Correction cues (bottom bar) ─────────────────────────────────────
        all_results = {}
        all_results.update(results.get("left_side",  {}))
        all_results.update(results.get("right_side", {}))
        all_results.update(results.get("both_sides", {}))

        wrong = [(n, r) for n, r in all_results.items()
                 if r.get("visible") and not r.get("is_correct")]
        wrong.sort(key=lambda x: x[1].get("severity", 0), reverse=True)

        fb_h = min(2, len(wrong)) * 24 + 32
        if wrong:
            fb_y = h - fb_h
            cv2.rectangle(frame, (0, fb_y), (w, h), (25, 25, 25), -1)
            cv2.putText(frame, "CORRECT:", (12, fb_y + 18),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.52, (255, 255, 255), 2)
            for i, (_, r) in enumerate(wrong[:2]):
                cv2.putText(frame, r["feedback"][:70],
                            (12, fb_y + 40 + i * 23),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.46, (100, 210, 255), 1)

    # ─────────────────────────────────────────────────────────────────────────
    # Public Draw Method  (called from main)
    # ─────────────────────────────────────────────────────────────────────────

    def draw_feedback(self, frame: np.ndarray, results: Dict,
                      pose_landmarks,   # NormalizedLandmarkList (full object)
                      exercise_name: str) -> np.ndarray:
        """
        Draws bilateral skeleton via MediaPipe native draw_landmarks() +
        custom color specs, then overlays HUD.

        IMPORTANT: pass results.pose_landmarks (not .landmark) from main.
        """
        annotated = frame.copy()
        h, w = annotated.shape[:2]

        if not results.get("has_valid_measurements", False):
            cv2.rectangle(annotated, (0, 0), (w, 110), (25, 25, 25), -1)
            cv2.putText(annotated, "NO PERSON DETECTED", (15, 50),
                        cv2.FONT_HERSHEY_DUPLEX, 0.9, (0, 0, 255), 2)
            cv2.putText(annotated, "Step into frame and face camera", (15, 82),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (180, 180, 180), 1)
            return annotated

        # Collect all joint results for color building
        all_results = {}
        all_results.update(results.get("left_side",  {}))
        all_results.update(results.get("right_side", {}))
        all_results.update(results.get("both_sides", {}))

        # Build DrawingSpec dicts
        lm_spec, conn_spec = self._build_drawing_specs(all_results)

        # ── Draw skeleton using MediaPipe's native API ──────────────────────
        mp_drawing = mp.solutions.drawing_utils
        mp_pose    = mp.solutions.pose

        mp_drawing.draw_landmarks(
            image                   = annotated,
            landmark_list           = pose_landmarks,          # full NormalizedLandmarkList
            connections             = mp_pose.POSE_CONNECTIONS,
            landmark_drawing_spec   = lm_spec,                 # per-landmark DrawingSpec dict
            connection_drawing_spec = conn_spec                # per-connection DrawingSpec dict
        )

        # ── Overlay HUD ─────────────────────────────────────────────────────
        self._draw_hud(annotated, results, exercise_name)

        return annotated

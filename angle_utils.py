import numpy as np
from typing import Optional, Tuple, List

# Pixel distance threshold to flag invalid landmarks that are squished together
MIN_PX_DISTANCE = 8.0

def calculate_angle(p1: np.ndarray, p2: np.ndarray, p3: np.ndarray) -> Optional[float]:
    """
    Calculate angle (degrees) at vertex p2 formed by rays p2->p1 and p2->p3.
    Returns angle between 0.0 and 180.0, or None if points are too close.
    """
    ba = p1 - p2
    bc = p3 - p2

    ba_n = np.linalg.norm(ba)
    bc_n = np.linalg.norm(bc)

    if ba_n < MIN_PX_DISTANCE or bc_n < MIN_PX_DISTANCE:
        return None

    cos_a = np.clip(np.dot(ba, bc) / (ba_n * bc_n), -1.0, 1.0)
    angle = np.degrees(np.arccos(cos_a))

    return float(angle) if 0.0 <= angle <= 180.0 else None

def validate_landmarks(landmarks, visible_scores: np.ndarray, 
                       indices: Tuple[int, int, int], 
                       visibility_threshold: float = 0.65,
                       width: int = 640, height: int = 480) -> Tuple[bool, str]:
    """
    Validates visibility and pixel separation of 3 landmark indices.
    """
    for idx in indices:
        if idx >= len(landmarks):
            return False, f"lm {idx} missing"
        if visible_scores[idx] < visibility_threshold:
            return False, f"lm {idx} occluded"
        
        lm = landmarks[idx]
        if not (0.0 <= lm.x <= 1.0 and 0.0 <= lm.y <= 1.0):
            return False, f"lm {idx} out of frame"

    # Pixel proximity check
    p0 = np.array([landmarks[indices[0]].x * width, landmarks[indices[0]].y * height])
    p1 = np.array([landmarks[indices[1]].x * width, landmarks[indices[1]].y * height])
    p2 = np.array([landmarks[indices[2]].x * width, landmarks[indices[2]].y * height])

    if np.linalg.norm(p0 - p1) < MIN_PX_DISTANCE:
        return False, "joints merged (0-1)"
    if np.linalg.norm(p1 - p2) < MIN_PX_DISTANCE:
        return False, "joints merged (1-2)"

    return True, "ok"

def is_full_body_visible(landmarks, visible_scores: np.ndarray, threshold: float = 0.65) -> bool:
    """
    Checks if core body landmarks (shoulders, hips, knees, ankles) are visible.
    We check both left and right sides. If BOTH sides are entirely occluded, body is not detected.
    Actually for robust detection, we should ensure at least one full side is completely visible.
    """
    if not landmarks or len(landmarks) < 33:
        return False
        
    left_side = [11, 23, 25, 27]  # shoulder, hip, knee, ankle
    right_side = [12, 24, 26, 28]

    left_ok = all(visible_scores[i] >= threshold for i in left_side)
    right_ok = all(visible_scores[i] >= threshold for i in right_side)

    # Require at least one full side profile to consider the body stabilized
    return left_ok or right_ok

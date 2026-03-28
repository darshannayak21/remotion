"""
MediaPipe Physiotherapy Standards — POST DISCHARGE EDITION
Consolidated from modular files to support all exercises.
"""

from exercises.exercises_sitting import EXERCISES as sitting_exercises
from exercises.exercises_mobility import EXERCISES as mobility_exercises
from exercises.exercises_functional import EXERCISES as functional_exercises
from exercises.exercises_standing import EXERCISES as standing_exercises

# ─────────────────────────────────────────────
# MediaPipe Landmark Map (reference only)
# ─────────────────────────────────────────────
MEDIAPIPE_LANDMARKS = {
    11: "left_shoulder", 12: "right_shoulder",
    13: "left_elbow",    14: "right_elbow",
    15: "left_wrist",    16: "right_wrist",
    23: "left_hip",      24: "right_hip",
    25: "left_knee",     26: "right_knee",
    27: "left_ankle",    28: "right_ankle",
}

# ─────────────────────────────────────────────
# Exercise Standards (Dynamically loaded)
# ─────────────────────────────────────────────
EXERCISE_STANDARDS = {}
EXERCISE_STANDARDS.update(sitting_exercises)
EXERCISE_STANDARDS.update(mobility_exercises)
EXERCISE_STANDARDS.update(functional_exercises)
EXERCISE_STANDARDS.update(standing_exercises)

# ─────────────────────────────────────────────
# CATEGORY MENU
# ─────────────────────────────────────────────
EXERCISE_CATEGORIES = {
    "Early Rehab / Activation (Low Stress)": [
        "seated_knee_extension",
        "straight_leg_raise",
        "sit_to_stand",
    ],

    "Standing Arm / Mobility / Posture": [
        "standing_sky_reach",
        "standing_side_bend_reach",
        "standing_arm_abduction",
        "standing_row_pull",
    ],

    "Standing Leg Strength (Rehab Safe)": [
        "standing_knee_raise",
        "standing_marching",
        "standing_forward_leg_raise",
        "standing_heel_to_butt",
        "standing_hamstring_curl",
        "standing_hip_extension",
        "supported_squat",
        "wall_sit",
        "standing_toe_raises",
    ],

    "Standing Exercises (Requires Balance - Hold Support)": [
        "standing_heel_raises",
        "mini_squat",
        "standing_hip_abduction",
        "wall_push_ups"
    ],

    "Functional Strength & Balance (Advanced Rehab)": [
        "forward_lunge",
        "side_lunge",
        "step_back_knee_drive",
        "single_leg_hip_hinge_supported",
    ],
}

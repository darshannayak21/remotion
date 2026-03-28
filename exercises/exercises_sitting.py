"""
Early Rehab & Seated Exercises
"""

EXERCISES = {
    "seated_knee_extension": {
        "description": (
            "Seated knee strengthening by fully straightening the leg. "
            "Excellent early rehab for quads activation after discharge."
        ),
        "instructions": [
            "Sit tall on a chair sideways to the camera",
            "Keep thigh supported on the chair",
            "Slowly straighten one knee until the leg is almost fully straight",
            "Hold 1–2 seconds, then lower slowly with control"
        ],
        "left": {
            "knee_extension": {
                "ideal_range": (165, 180),
                "keypoints": (23, 25, 27),
                "feedback": "Straighten LEFT knee more ({angle:.0f}°)"
            }
        },
        "right": {
            "knee_extension": {
                "ideal_range": (165, 180),
                "keypoints": (24, 26, 28),
                "feedback": "Straighten RIGHT knee more ({angle:.0f}°)"
            }
        },
        "camera_view": "Side view"
    },

    "straight_leg_raise": {
        "description": (
            "Hip flexor and quadriceps activation with a straight leg lift. "
            "Useful for knee rehab and hip strengthening."
        ),
        "instructions": [
            "Lie sideways relative to the camera",
            "Keep the working knee straight",
            "Lift the straight leg up slowly",
            "Lower slowly without bending the knee"
        ],
        "left": {
            "hip_flexion": {
                "ideal_range": (120, 155),
                "keypoints": (11, 23, 25),
                "feedback": "Lift LEFT leg slightly higher"
            }
        },
        "right": {
            "hip_flexion": {
                "ideal_range": (120, 155),
                "keypoints": (12, 24, 26),
                "feedback": "Lift RIGHT leg slightly higher"
            }
        },
        "camera_view": "Side view"
    },

    "sit_to_stand": {
        "description": "Chair sit-to-stand for functional leg strength and balance.",
        "instructions": [
            "Stand sideways to camera with chair behind you",
            "Sit down slowly",
            "Lean forward slightly and stand back up",
            "Avoid using hands if possible"
        ],
        "both": {
            "knee_bend_left": {
                "ideal_range": (70, 110),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT knee bend more while sitting"
            },
            "knee_bend_right": {
                "ideal_range": (70, 110),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT knee bend more while sitting"
            }
        },
        "camera_view": "Side view"
    }
}

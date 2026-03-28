"""
Functional Strength & Balance (Advanced Rehab)
"""

EXERCISES = {
    "forward_lunge": {
        "description": "Forward lunge for quad, glute, and knee stability (excellent rehab strength).",
        "instructions": [
            "Stand sideways to camera",
            "Step one foot forward",
            "Lower into a lunge (front knee bends)",
            "Push back to start"
        ],
        "left": {
            "front_knee_angle": {
                "ideal_range": (70, 115),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT front knee: bend into lunge more"
            }
        },
        "right": {
            "front_knee_angle": {
                "ideal_range": (70, 115),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT front knee: bend into lunge more"
            }
        },
        "camera_view": "Side view"
    },

    "side_lunge": {
        "description": "Side lunge for hip strength, adductors, and lateral stability.",
        "instructions": [
            "Stand facing camera",
            "Step one foot out to the side",
            "Bend the stepping knee while keeping the other leg straighter",
            "Push back to center"
        ],
        "left": {
            "knee_bend": {
                "ideal_range": (85, 130),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT side lunge: bend knee more"
            }
        },
        "right": {
            "knee_bend": {
                "ideal_range": (85, 130),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT side lunge: bend knee more"
            }
        },
        "camera_view": "Front view"
    },

    "step_back_knee_drive": {
        "description": "Step back then drive knee up (balance + hip flexor strengthening).",
        "instructions": [
            "Stand facing camera",
            "Step one leg backward",
            "Return and lift the same knee up",
            "Control balance and posture"
        ],
        "left": {
            "knee_drive": {
                "ideal_range": (60, 110),
                "keypoints": (23, 25, 27),
                "feedback": "Drive LEFT knee higher"
            }
        },
        "right": {
            "knee_drive": {
                "ideal_range": (60, 110),
                "keypoints": (24, 26, 28),
                "feedback": "Drive RIGHT knee higher"
            }
        },
        "camera_view": "Front view"
    },

    "single_leg_hip_hinge_supported": {
        "description": (
            "Supported single-leg hip hinge (RDL pattern) for glute + hamstring strength "
            "and balance. One of the best functional rehab movements."
        ),
        "instructions": [
            "Stand sideways to camera",
            "Hold chair lightly for balance",
            "Hinge forward at the hip (do not round back)",
            "Return to upright slowly"
        ],
        "left": {
            "hip_hinge": {
                "ideal_range": (95, 140),
                "keypoints": (11, 23, 25),
                "feedback": "Hinge forward more from LEFT hip"
            }
        },
        "right": {
            "hip_hinge": {
                "ideal_range": (95, 140),
                "keypoints": (12, 24, 26),
                "feedback": "Hinge forward more from RIGHT hip"
            }
        },
        "camera_view": "Side view"
    }
}

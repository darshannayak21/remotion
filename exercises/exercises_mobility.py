"""
Standing Arm / Mobility / Posture Exercises
"""

EXERCISES = {
    "standing_sky_reach": {
        "description": (
            "Overhead shoulder mobility and upper-back stretch. "
            "Good for posture, shoulder stiffness, and thoracic extension."
        ),
        "instructions": [
            "Stand facing the camera",
            "Raise one arm straight overhead",
            "Keep elbow locked and avoid shrugging",
            "Return slowly"
        ],
        "left": {
            "shoulder_flexion": {
                "ideal_range": (160, 180),
                "keypoints": (23, 11, 13),
                "feedback": "Raise LEFT arm higher"
            },
            "elbow_extension": {
                "ideal_range": (165, 180),
                "keypoints": (11, 13, 15),
                "feedback": "Straighten LEFT elbow"
            }
        },
        "right": {
            "shoulder_flexion": {
                "ideal_range": (160, 180),
                "keypoints": (24, 12, 14),
                "feedback": "Raise RIGHT arm higher"
            },
            "elbow_extension": {
                "ideal_range": (165, 180),
                "keypoints": (12, 14, 16),
                "feedback": "Straighten RIGHT elbow"
            }
        },
        "camera_view": "Front view"
    },

    "standing_side_bend_reach": {
        "description": (
            "Standing lateral trunk stretch with arm reach. "
            "Targets side body, ribs, and hip flexibility (QL + obliques)."
        ),
        "instructions": [
            "Stand upright facing the camera",
            "Raise one arm overhead",
            "Slowly bend your torso sideways (do not twist)",
            "Keep hips facing forward and avoid leaning forward/back",
            "Return to upright"
        ],
        "left": {
            "trunk_lateral_flexion": {
                "ideal_range": (115, 140),
                "keypoints": (25, 23, 11),
                "feedback": "Bend torso LEFT more (current {angle:.0f}°)"
            }
        },
        "right": {
            "trunk_lateral_flexion": {
                "ideal_range": (115, 140),
                "keypoints": (26, 24, 12),
                "feedback": "Bend torso RIGHT more (current {angle:.0f}°)"
            }
        },
        "camera_view": "Front view"
    },

    "standing_arm_abduction": {
        "description": (
            "Shoulder strengthening by lifting arm sideways to shoulder height. "
            "Great for rotator cuff and shoulder stability."
        ),
        "instructions": [
            "Stand facing camera",
            "Lift arm sideways until roughly shoulder height",
            "Keep elbow straight",
            "Lower slowly without swinging"
        ],
        "left": {
            "shoulder_abduction": {
                "ideal_range": (80, 110),
                "keypoints": (23, 11, 13),
                "feedback": "Lift LEFT arm to shoulder height"
            },
            "elbow_extension": {
                "ideal_range": (165, 180),
                "keypoints": (11, 13, 15),
                "feedback": "Straighten LEFT elbow"
            }
        },
        "right": {
            "shoulder_abduction": {
                "ideal_range": (80, 110),
                "keypoints": (24, 12, 14),
                "feedback": "Lift RIGHT arm to shoulder height"
            },
            "elbow_extension": {
                "ideal_range": (165, 180),
                "keypoints": (12, 14, 16),
                "feedback": "Straighten RIGHT elbow"
            }
        },
        "camera_view": "Front view"
    },

    "standing_row_pull": {
        "description": (
            "Upper-back and posture exercise simulating a resistance band row. "
            "Strengthens mid-back and improves shoulder positioning."
        ),
        "instructions": [
            "Stand facing camera",
            "Pull elbows backward like rowing",
            "Keep forearms roughly level",
            "Squeeze shoulder blades gently"
        ],
        "left": {
            "elbow_flexion": {
                "ideal_range": (55, 105),
                "keypoints": (11, 13, 15),
                "feedback": "Bend LEFT elbow more"
            }
        },
        "right": {
            "elbow_flexion": {
                "ideal_range": (55, 105),
                "keypoints": (12, 14, 16),
                "feedback": "Bend RIGHT elbow more"
            }
        },
        "camera_view": "Front view"
    }
}

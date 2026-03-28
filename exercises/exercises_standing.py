"""
Standing Leg Strength & Focus Exercises
(Includes advanced form tracking for specific standing mechanics)
"""

EXERCISES = {
    "standing_knee_raise": {
        "description": "Hip flexion and balance training. Great for gait retraining.",
        "instructions": [
            "Stand facing camera",
            "Lift one knee upward toward waist level",
            "Keep torso tall (avoid leaning back)",
            "Lower slowly"
        ],
        "left": {
            "knee_flexion": {
                "ideal_range": (60, 110),
                "keypoints": (23, 25, 27),
                "feedback": "Lift LEFT knee higher"
            }
        },
        "right": {
            "knee_flexion": {
                "ideal_range": (60, 110),
                "keypoints": (24, 26, 28),
                "feedback": "Lift RIGHT knee higher"
            }
        },
        "camera_view": "Front view"
    },

    "standing_marching": {
        "description": "Marching in place for gait retraining, hip flexion, and endurance.",
        "instructions": [
            "Stand facing camera",
            "Lift knees alternately",
            "Maintain upright posture",
            "Keep movement controlled"
        ],
        "left": {
            "knee_raise": {
                "ideal_range": (60, 115),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT knee: lift higher"
            }
        },
        "right": {
            "knee_raise": {
                "ideal_range": (60, 115),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT knee: lift higher"
            }
        },
        "camera_view": "Front view"
    },

    "standing_forward_leg_raise": {
        "description": "Straight-leg hip flexion for strength and control.",
        "instructions": [
            "Stand sideways to camera",
            "Keep knee straight",
            "Lift leg forward slowly",
            "Lower slowly without swinging"
        ],
        "left": {
            "hip_flexion": {
                "ideal_range": (120, 150),
                "keypoints": (11, 23, 25),
                "feedback": "Lift LEFT leg higher"
            },
            "knee_lock": {
                "ideal_range": (165, 180),
                "keypoints": (23, 25, 27),
                "feedback": "Keep LEFT knee straighter"
            }
        },
        "right": {
            "hip_flexion": {
                "ideal_range": (120, 150),
                "keypoints": (12, 24, 26),
                "feedback": "Lift RIGHT leg higher"
            },
            "knee_lock": {
                "ideal_range": (165, 180),
                "keypoints": (24, 26, 28),
                "feedback": "Keep RIGHT knee straighter"
            }
        },
        "camera_view": "Side view"
    },

    "standing_heel_to_butt": {
        "description": "Quadriceps stretch through knee flexion.",
        "instructions": [
            "Stand sideways to camera",
            "Bend knee backward",
            "Bring heel toward glutes",
            "Return slowly"
        ],
        "left": {
            "knee_flexion": {
                "ideal_range": (30, 75),
                "keypoints": (23, 25, 27),
                "feedback": "Bring LEFT heel closer"
            }
        },
        "right": {
            "knee_flexion": {
                "ideal_range": (30, 75),
                "keypoints": (24, 26, 28),
                "feedback": "Bring RIGHT heel closer"
            }
        },
        "camera_view": "Side view"
    },

    "standing_hamstring_curl": {
        "description": "Standing hamstring curl to strengthen back of thigh.",
        "instructions": [
            "Stand sideways to camera",
            "Bend knee bringing heel upward",
            "Keep thigh mostly vertical",
            "Lower slowly"
        ],
        "left": {
            "knee_flexion": {
                "ideal_range": (40, 95),
                "keypoints": (23, 25, 27),
                "feedback": "Curl LEFT heel higher"
            }
        },
        "right": {
            "knee_flexion": {
                "ideal_range": (40, 95),
                "keypoints": (24, 26, 28),
                "feedback": "Curl RIGHT heel higher"
            }
        },
        "camera_view": "Side view"
    },

    "standing_hip_extension": {
        "description": "Standing hip extension for glute strengthening.",
        "instructions": [
            "Stand sideways to camera",
            "Keep knee mostly straight",
            "Extend one leg backward",
            "Avoid arching the low back"
        ],
        "left": {
            "hip_extension": {
                "ideal_range": (120, 155),
                "keypoints": (11, 23, 25),
                "feedback": "Move LEFT leg further back"
            }
        },
        "right": {
            "hip_extension": {
                "ideal_range": (120, 155),
                "keypoints": (12, 24, 26),
                "feedback": "Move RIGHT leg further back"
            }
        },
        "camera_view": "Side view"
    },

    "supported_squat": {
        "description": "Supported squat (deeper than mini squat) for strength and control.",
        "instructions": [
            "Stand facing camera (hold chair lightly if needed)",
            "Sit hips back and bend knees",
            "Keep chest tall",
            "Return to standing slowly"
        ],
        "both": {
            "knee_angle_left": {
                "ideal_range": (70, 105),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT knee: squat a bit deeper"
            },
            "knee_angle_right": {
                "ideal_range": (70, 105),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT knee: squat a bit deeper"
            }
        },
        "camera_view": "Front view"
    },

    "wall_sit": {
        "description": "Isometric lower-body strength hold.",
        "instructions": [
            "Stand sideways to camera",
            "Slide down a wall until knees are bent",
            "Hold steady without collapsing forward",
            "Stand back up carefully"
        ],
        "both": {
            "knee_angle_left": {
                "ideal_range": (80, 110),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT knee near 90°"
            },
            "knee_angle_right": {
                "ideal_range": (80, 110),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT knee near 90°"
            }
        },
        "camera_view": "Side view"
    },

    "standing_toe_raises": {
        "description": "Toe raises (lifting forefoot) for shin strength and ankle control.",
        "instructions": [
            "Stand facing camera",
            "Lift toes up while heels stay down",
            "Keep knees straight",
            "Lower slowly"
        ],
        "both": {
            "knee_lock_left": {
                "ideal_range": (160, 180),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT knee: keep straighter"
            },
            "knee_lock_right": {
                "ideal_range": (160, 180),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT knee: keep straighter"
            }
        },
        "camera_view": "Front view"
    },

    # =========================================================================
    # UPGRADED STANDING EXERCISES (FULL BODY TRACKING)
    # =========================================================================

    "mini_squat": {
        "description": "Partial squat for knee/hip strengthening, WITH full body posture tracking.",
        "instructions": [
            "Stand facing camera",
            "Feet hip-width apart",
            "Bend knees slightly (small squat)",
            "Keep back completely straight and chest upright",
            "Stand back up"
        ],
        "both": {
            "knee_angle_left": {
                "ideal_range": (95, 125),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT knee: bend slightly more ({angle:.0f}°)"
            },
            "knee_angle_right": {
                "ideal_range": (95, 125),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT knee: bend slightly more ({angle:.0f}°)"
            },
            # NEW: Back/Torso straightness tracking 
            "back_posture_left": {
                "ideal_range": (80, 140), # Hip angle narrows as we squat, but shouldn't completely collapse
                "keypoints": (11, 23, 25),
                "feedback": "LEFT side: keep chest up, back straight"
            },
            "back_posture_right": {
                "ideal_range": (80, 140),
                "keypoints": (12, 24, 26),
                "feedback": "RIGHT side: keep chest up, back straight"
            }
        },
        "camera_view": "Front/Side view"
    },

    "standing_heel_raises": {
        "description": "Calf strengthening by rising up onto toes, ensuring straight back.",
        "instructions": [
            "Stand facing camera",
            "Rise up onto toes",
            "Keep knees and whole body perfectly straight",
            "Lower slowly"
        ],
        "both": {
            "knee_lock_left": {
                "ideal_range": (160, 180),
                "keypoints": (23, 25, 27),
                "feedback": "LEFT knee: keep straighter"
            },
            "knee_lock_right": {
                "ideal_range": (160, 180),
                "keypoints": (24, 26, 28),
                "feedback": "RIGHT knee: keep straighter"
            },
            # NEW: Body alignment tracking
            "body_alignment_left": {
                "ideal_range": (160, 180),
                "keypoints": (11, 23, 27),
                "feedback": "LEFT side: keep body tall and perfectly straight"
            },
            "body_alignment_right": {
                "ideal_range": (160, 180),
                "keypoints": (12, 24, 28),
                "feedback": "RIGHT side: keep body tall and perfectly straight"
            }
        },
        "camera_view": "Side view"
    },

    "standing_hip_abduction": {
        "description": "Standing side leg raise for glute medius, ensuring torso stays upright.",
        "instructions": [
            "Stand facing camera",
            "Keep torso upright",
            "Lift one leg out to the side",
            "Avoid leaning sideways with your torso"
        ],
        "left": {
            "hip_abduction": {
                "ideal_range": (135, 165),
                "keypoints": (11, 23, 25),
                "feedback": "Lift LEFT leg more to the side"
            },
            # NEW: Standing leg and torso tracking
            "torso_and_standing_leg": {
                "ideal_range": (160, 180),
                "keypoints": (12, 24, 26), # Tracking the RIGHT side to ensure it's straight
                "feedback": "Keep RIGHT standing leg and back straight (don't lean)"
            }
        },
        "right": {
            "hip_abduction": {
                "ideal_range": (135, 165),
                "keypoints": (12, 24, 26),
                "feedback": "Lift RIGHT leg more to the side"
            },
            # NEW: Standing leg and torso tracking
            "torso_and_standing_leg": {
                "ideal_range": (160, 180),
                "keypoints": (11, 23, 25), # Tracking the LEFT side to ensure it's straight
                "feedback": "Keep LEFT standing leg and back straight (don't lean)"
            }
        },
        "camera_view": "Front view"
    },

    "wall_push_ups": {
        "description": "Standing wall push-ups for chest/arm strength + full body core control.",
        "instructions": [
            "Stand facing a wall",
            "Place hands on wall at shoulder height",
            "Keep your entire body entirely straight like a plank",
            "Bend elbows to bring chest to wall, then push back"
        ],
        "both": {
            "elbow_flexion_left": {
                "ideal_range": (60, 180),
                "keypoints": (11, 13, 15),
                "feedback": "LEFT arm: bend and extend elbows smoothly"
            },
            "elbow_flexion_right": {
                "ideal_range": (60, 180),
                "keypoints": (12, 14, 16),
                "feedback": "RIGHT arm: bend and extend elbows smoothly"
            },
            # NEW: Full body plank tracking
            "body_plank_left": {
                "ideal_range": (155, 180),
                "keypoints": (11, 23, 27),
                "feedback": "LEFT side: Keep hips in line! Body must be perfectly straight."
            },
            "body_plank_right": {
                "ideal_range": (155, 180),
                "keypoints": (12, 24, 28),
                "feedback": "RIGHT side: Keep hips in line! Body must be perfectly straight."
            }
        },
        "camera_view": "Side view"
    }
}

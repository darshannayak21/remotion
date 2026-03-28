"""
FLEX Coaching Scripts & Config
Defines standing exercises with strict joint parameters and deeply human, deterministic coaching scripts.
"""

EXERCISE_CONFIG = {

    # ─────────────────────────────────────────────────────────────
    # STANDING ARM / MOBILITY / POSTURE
    # ─────────────────────────────────────────────────────────────
    "standing_sky_reach": {
        "intro": [
            "Face the camera. Stand tall and reach one arm straight up toward the ceiling."
        ],
        "left": {
            "shoulder_flexion": {
                "ideal_range": (160, 180),
                "keypoints": (23, 11, 13),
                "cues": [
                    "Your left arm isn't quite vertical. Try to reach it just a bit higher toward the ceiling.",
                    "Bring your left arm closer to your ear to get that full range of motion.",
                    "I notice your left shoulder angle is a bit shallow. Try to push it straight up."
                ]
            },
            "elbow_extension": {
                "ideal_range": (160, 180),
                "keypoints": (11, 13, 15),
                "cues": [
                    "Your left elbow is slightly bent. Make sure to lock it out completely.",
                    "Straighten that left arm out fully at the top.",
                    "Keep your left arm completely straight as you reach up."
                ]
            }
        },
        "right": {
            "shoulder_flexion": {
                "ideal_range": (160, 180),
                "keypoints": (24, 12, 14),
                "cues": [
                    "Your right arm isn't vertically aligned. Reach it a bit higher toward the ceiling.",
                    "Try to bring your right arm completely parallel to your ear.",
                    "Push that right shoulder straight up for a deeper stretch."
                ]
            },
            "elbow_extension": {
                "ideal_range": (160, 180),
                "keypoints": (12, 14, 16),
                "cues": [
                    "Your right elbow looks a bit bent. Keep it fully extended.",
                    "Straighten your right arm completely.",
                    "Lock out that right elbow at the top of the movement."
                ]
            }
        }
    },

    "standing_side_bend_reach": {
        "intro": [
            "Face the camera. Keep your hips still and bend your torso to the side."
        ],
        "left": {
             "trunk_lateral_flexion": {
                "ideal_range": (115, 140),
                "keypoints": (25, 23, 11),
                "cues": [
                    "You're not bending quite far enough to the left. Try dropping your torso a bit lower.",
                    "Lean a little further into the left side bend to feel the stretch in your obliques.",
                    "I don't see enough angle in your spine. Drop your shoulder further to the left."
                ]
            }
        },
        "right": {
             "trunk_lateral_flexion": {
                "ideal_range": (115, 140),
                "keypoints": (26, 24, 12),
                "cues": [
                    "You're not bending quite far enough to the right. Try dropping your torso a bit lower.",
                    "Lean a little further into the right side bend for a deeper stretch.",
                    "I don't see enough angle in your spine. Drop your right shoulder further down."
                ]
            }
        }
    },

    "standing_arm_abduction": {
        "intro": [
            "Face the camera. Lift your arm straight out to the side up to shoulder height."
        ],
        "left": {
            "shoulder_abduction": {
                "ideal_range": (80, 110),
                "keypoints": (23, 11, 13),
                "cues": [
                    "Your left arm is dropping low. Bring it up until it's perfectly parallel to the floor.",
                    "Raise your left arm a bit higher to hit that 90-degree mark.",
                    "Lift your left arm straight out to the side a little higher."
                ]
            }
        },
        "right": {
            "shoulder_abduction": {
                "ideal_range": (80, 110),
                "keypoints": (24, 12, 14),
                "cues": [
                    "Your right arm is a bit low. Lift it up to shoulder height.",
                    "Raise your right arm until it is parallel with the floor.",
                    "Keep that right arm up, don't let it drop below 90 degrees."
                ]
            }
        }
    },

    "standing_row_pull": {
        "intro": [
            "Stand sideways. Pull both elbows back and squeeze your shoulder blades together."
        ],
        "both": {
            "elbow_flexion_left": {
                "ideal_range": (50, 105),
                "keypoints": (11, 13, 15),
                "cues": [
                    "Pull your left elbow much further back behind your torso.",
                    "I'm not seeing enough squeeze on the left side. Bring that elbow tightly behind you.",
                    "Drive your left elbow back further to engage your lats."
                ]
            },
            "elbow_flexion_right": {
                "ideal_range": (50, 105),
                "keypoints": (12, 14, 16),
                "cues": [
                    "Pull your right elbow much further back behind your torso.",
                    "Squeeze your right shoulder blade tighter by bringing the elbow back.",
                    "Drive your right elbow back further, open up that chest."
                ]
            }
        }
    },

    # ─────────────────────────────────────────────────────────────
    # STANDING LEG STRENGTH
    # ─────────────────────────────────────────────────────────────
    
    "standing_knee_raise": {
        "intro": [
            "Stand sideways. Lift one knee up to waist height without leaning back."
        ],
        "left": {
            "knee_flexion": {
                "ideal_range": (60, 110),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your left knee is too low. Try to drive it up until your thigh is parallel to the ground.",
                    "Bring that left knee closer to waist height.",
                    "Lift your left leg higher, you're not quite getting the height."
                ]
            }
        },
        "right": {
            "knee_flexion": {
                "ideal_range": (60, 110),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee is too low. Bring it up until your thigh is parallel with the floor.",
                    "Drive that right knee up closer to your waist.",
                    "Try to lift your right leg a little higher."
                ]
            }
        }
    },

    "standing_marching": {
        "intro": [
            "Stand sideways. March in place, lifting your knees up with a steady rhythm."
        ],
        "left": {
            "knee_raise": {
                "ideal_range": (60, 115),
                "keypoints": (23, 25, 27),
                "cues": ["You're shortchanging the left leg. Lift that knee higher as you march."]
            }
        },
        "right": {
            "knee_raise": {
                "ideal_range": (60, 115),
                "keypoints": (24, 26, 28),
                "cues": ["Your right knee is dropping low. March it up higher!"]
            }
        }
    },

    "supported_squat": {
        "intro": [
            "Stand sideways. Keep your chest up and slowly sink down into the squat."
        ],
        "both": {
            "knee_angle_left": {
                "ideal_range": (70, 105),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your squat is a bit shallow. Try to sit back and bend your knees a little deeper.",
                    "You're not quite hitting depth. Sink down until your thighs are closer to parallel.",
                    "Drop lower into the squat, your knees aren't fully engaged."
                ]
            },
            "knee_angle_right": {
                "ideal_range": (70, 105),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your squat is a bit shallow on the right side. Sit back and bend deeper.",
                    "Drop lower into the squat. Let's try to hit that 90 degree mark.",
                    "You're stopping too early. Try to bend your knees a bit more."
                ]
            },
            "back_posture_left": {
                "ideal_range": (80, 145),
                "keypoints": (11, 23, 25),
                "cues": [
                    "Your back is completely rounded. Keep your chest up and straighten your spine.",
                    "I notice you are leaning too far forward. Pull your shoulders back and sit upright.",
                    "Don't let your chest collapse. Keep an upright posture as you squat."
                ]
            },
             "back_posture_right": {
                "ideal_range": (80, 145),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Your back is leaning very far forward. Straighten your spine and look straight ahead.",
                    "Keep your chest up proudly. Try not to fold over at the hips.",
                    "You are losing your posture. Keep that back completely straight."
                ]
            }
        }
    },
    
    "wall_sit": {
        "is_hold_based": True,
        "intro": [
            "Stand sideways against a wall. Press your back flat and bend your knees to ninety degrees."
        ],
        "both": {
            "knee_angle_left": {
                "ideal_range": (80, 110),
                "keypoints": (23, 25, 27),
                "cues": [
                    "You're standing up too straight. Slide down the wall until your knees are at 90 degrees.",
                    "Sink deeper into the wall sit to really engage those quads."
                ]
            },
            "knee_angle_right": {
                "ideal_range": (80, 110),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee isn't bent enough. Slide further down the wall.",
                    "Drop lower into the hold. Your knees should form a perfect right angle."
                ]
            }
        }
    },

    "standing_toe_raises": {
        "intro": [
            "Stand sideways. Lock your knees straight and lift your toes up toward your shins."
        ],
        "both": {
            "knee_lock_left": {
                "ideal_range": (160, 180),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your left knee is bending. Make sure to keep it perfectly locked straight.",
                    "Don't let that left knee buckle. Keep your leg totally stiff."
                ]
            },
            "knee_lock_right": {
                "ideal_range": (160, 180),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee is bending. Fully lock it out.",
                    "Keep your right leg completely straight as you lift your toes."
                ]
            }
        }
    },

    "standing_forward_leg_raise": {
        "intro": [
            "Stand sideways. Keep your leg straight and lift it forward slowly."
        ],
        "left": {
            "hip_flexion": {
                "ideal_range": (130, 165),
                "keypoints": (11, 23, 25),
                "cues": [
                    "You aren't lifting your left leg high enough. Bring it up further.", 
                    "Squeeze your quad and raise that left leg higher in front of you."
                ]
            }
        },
        "right": {
            "hip_flexion": {
                "ideal_range": (130, 165),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Your right leg is too low. Try to lift it higher into the air.", 
                    "Keep the leg straight and push your right foot higher up."
                ]
            }
        }
    },

    "standing_heel_to_butt": {
        "intro": [
            "Stand sideways. Bend your knee and pull your heel up toward your glute."
        ],
        "left": {
            "knee_flexion": {
                "ideal_range": (30, 90),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your left heel isn't coming back far enough. Pull it closer to your butt.",
                    "Bend that left knee completely, try to touch your heel to your glute."
                ]
            }
        },
        "right": {
            "knee_flexion": {
                "ideal_range": (30, 90),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right heel is dropping tight. Pull it much further back towards your butt.",
                    "Increase the bend in your right knee. Bring that heel up higher behind you."
                ]
            }
        }
    },

    "standing_hamstring_curl": {
        "intro": [
            "Stand sideways. Keep your knees aligned and curl your heel straight up."
        ],
        "left": {
            "knee_flexion": {
                "ideal_range": (45, 100),
                "keypoints": (23, 25, 27),
                "cues": [
                    "I don't see enough bend. Curl your left heel higher.",
                    "Squeeze that hamstring and pull your left foot up a bit more."
                ]
            }
        },
        "right": {
            "knee_flexion": {
                "ideal_range": (45, 100),
                "keypoints": (24, 26, 28),
                "cues": [
                    "You need a deeper curl. Pull your right heel higher.",
                    "Flex your hamstring harder and bring that right foot up."
                ]
            }
        }
    },

    "standing_hip_extension": {
        "intro": [
            "Stand sideways. Keep your knee straight and push your leg backward."
        ],
        "left": {
            "hip_extension": {
                "ideal_range": (160, 185),
                "keypoints": (11, 23, 25),
                "cues": [
                    "Push your left leg further backward to really activate the glute.", 
                    "You're not extending back far enough on the left side."
                ]
            }
        },
        "right": {
            "hip_extension": {
                "ideal_range": (160, 185),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Push your right leg further backward to really activate the glute.", 
                    "You're not extending back far enough on the right side."
                ]
            }
        }
    },

    "standing_heel_raises": {
        "intro": [
            "Stand sideways. Rise up high onto your toes, keeping your body tall."
        ],
        "both": {
            "ankle_extension_left": {
                "ideal_range": (140, 165),
                "keypoints": (25, 27, 31),
                "cues": [
                    "You aren't lifting your left heel high enough. Rise up onto those tiptoes.",
                    "Push harder through your left calves. Get taller!"
                ]
            },
            "ankle_extension_right": {
                "ideal_range": (140, 165),
                "keypoints": (26, 28, 32),
                "cues": [
                    "You aren't lifting your right heel high enough. Rise up onto those tiptoes.",
                    "Push harder through your right calves. Get taller!"
                ]
            }
        }
    },

    "mini_squat": {
        "intro": [
            "Stand sideways. Do a small bend in the knees, chest up, back straight."
        ],
        "both": {
            "knee_angle_left": {
                "ideal_range": (140, 165),
                "keypoints": (23, 25, 27),
                "cues": [
                    "You're standing up too tall. Give me just a little more bend in those knees.",
                    "Sink down just a fraction more to properly engage the quads."
                ]
            },
            "knee_angle_right": {
                "ideal_range": (140, 165),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your knees are too straight. Bend them slightly into the mini squat.",
                    "Just sit back a tiny bit more. You haven't quite reached the angle."
                ]
            }
        }
    },

    "standing_hip_abduction": {
        "intro": [
            "Face the camera. Keep your upper body still and lift your leg out to the side."
        ],
        "left": {
            "hip_abduction": {
                "ideal_range": (150, 175),
                "keypoints": (11, 23, 25),
                "cues": [
                    "Your left leg is dropping early. Lift it further out to the side to hit the glute medius.",
                    "Try to swing that left leg out just a bit wider."
                ]
            }
        },
        "right": {
            "hip_abduction": {
                "ideal_range": (150, 175),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Your right leg is dropping early. Lift it further out to the side.",
                    "Try to push that right leg out just a bit wider from your body."
                ]
            }
        }
    },

    "wall_push_ups": {
        "intro": [
            "Stand sideways. Lean against the wall and bend your elbows to bring your chest close to it."
        ],
        "both": {
            "elbow_angle_left": {
                "ideal_range": (60, 110),
                "keypoints": (11, 13, 15),
                "cues": [
                    "You're stopping short on the left side. Bend your elbow deeper.", 
                    "Bring your chest closer to the wall by bending your left arm further."
                ]
            },
            "elbow_angle_right": {
                "ideal_range": (60, 110),
                "keypoints": (12, 14, 16),
                "cues": [
                    "You're stopping short on the right side. Bend your elbow deeper.", 
                    "Ensure your right arm bends to 90 degrees to get a full rep."
                ]
            }
        }
    },

    # ─────────────────────────────────────────────────────────────
    # EARLY REHAB / SEATED EXERCISES
    # ─────────────────────────────────────────────────────────────

    "seated_knee_extension": {
        "intro": [
            "Sit sideways in a chair. Straighten one leg fully out in front of you."
        ],
        "left": {
            "knee_extension": {
                "ideal_range": (165, 180),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your left leg isn't fully straight. Lock that knee out completely.",
                    "Push your left foot out further and squeeze the quad tight.",
                    "Almost there. Straighten your left knee all the way."
                ]
            }
        },
        "right": {
            "knee_extension": {
                "ideal_range": (165, 180),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee still has a bend. Fully extend it.",
                    "Straighten your right leg completely. Squeeze the quad at the top.",
                    "Push through on the right side. Lock it out fully."
                ]
            }
        }
    },

    "straight_leg_raise": {
        "intro": [
            "Lie or sit sideways. Lock your knee straight and lift the whole leg up."
        ],
        "left": {
            "hip_flexion": {
                "ideal_range": (120, 155),
                "keypoints": (11, 23, 25),
                "cues": [
                    "Your left leg isn't high enough. Keep the knee locked and lift higher.",
                    "More height on the left. Squeeze your quad and raise from the hip.",
                    "Lift your left leg higher. Reach your heel toward the ceiling."
                ]
            }
        },
        "right": {
            "hip_flexion": {
                "ideal_range": (120, 155),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Your right leg needs to come up higher. Lock the knee and lift.",
                    "Not high enough on the right. Squeeze your quad and raise it more.",
                    "Lift your right leg higher. Keep it stiff like a board."
                ]
            }
        }
    },

    "sit_to_stand": {
        "intro": [
            "Sit sideways in a chair. Stand up without using your hands, then sit back down slowly."
        ],
        "both": {
            "knee_bend_left": {
                "ideal_range": (70, 110),
                "keypoints": (23, 25, 27),
                "cues": [
                    "You're not going low enough. Lower all the way to the chair.",
                    "Bend your left knee deeper. Sit fully back into the chair.",
                    "Slow down the descent. Control it with a deeper knee bend."
                ]
            },
            "knee_bend_right": {
                "ideal_range": (70, 110),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right side is cutting short. Sit all the way down.",
                    "Bend your right knee more as you lower into the chair.",
                    "Take your time going down. Bend deeper on the right side."
                ]
            }
        }
    },

    # ─────────────────────────────────────────────────────────────
    # FUNCTIONAL STRENGTH & BALANCE (ADVANCED REHAB)
    # ─────────────────────────────────────────────────────────────

    "forward_lunge": {
        "intro": [
            "Stand sideways. Step forward and bend your front knee to ninety degrees, chest up."
        ],
        "left": {
            "front_knee_angle": {
                "ideal_range": (70, 115),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your left knee isn't bending deep enough. Drop your hips lower.",
                    "Sink deeper into the left lunge. Get your thigh parallel.",
                    "Not deep enough on the left. Take a bigger step and drop down."
                ]
            }
        },
        "right": {
            "front_knee_angle": {
                "ideal_range": (70, 115),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee needs to bend further. Drop your hips lower.",
                    "Sink deeper on the right. Get that thigh closer to parallel.",
                    "More depth on the right lunge. Bend and lower your hips."
                ]
            }
        }
    },

    "side_lunge": {
        "intro": [
            "Face the camera. Step wide to the side, bend that knee, and push your hips back."
        ],
        "left": {
            "knee_bend": {
                "ideal_range": (85, 130),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Bend your left knee deeper into the side lunge. Sit back more.",
                    "Your left side lunge is too shallow. Push your hips back.",
                    "Drop lower on the left. Bend like you're sitting into a chair sideways."
                ]
            }
        },
        "right": {
            "knee_bend": {
                "ideal_range": (85, 130),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee isn't bending enough. Drop your hips lower.",
                    "Push your hips back further and bend your right knee more.",
                    "Go lower on the right side. Sit deeper into the lunge."
                ]
            }
        }
    },

    "step_back_knee_drive": {
        "intro": [
            "Stand sideways. Step one leg back, then drive that knee forward and up."
        ],
        "left": {
            "knee_drive": {
                "ideal_range": (60, 110),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Drive your left knee much higher. Get it up to waist level.",
                    "Your left knee drive is too low. Snap it up to your chest.",
                    "More height on the left knee. Really push it upward."
                ]
            }
        },
        "right": {
            "knee_drive": {
                "ideal_range": (60, 110),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Drive your right knee higher. Get it to waist level or above.",
                    "Your right knee isn't high enough. Explode it upward.",
                    "More power on the right knee drive. Bring it up to chest level."
                ]
            }
        }
    },

    "single_leg_hip_hinge_supported": {
        "intro": [
            "Stand sideways. Balance on one leg and hinge forward at the hip, back flat."
        ],
        "left": {
            "hip_hinge": {
                "ideal_range": (95, 140),
                "keypoints": (11, 23, 25),
                "cues": [
                    "Hinge forward more from your left hip. Push your hips back.",
                    "Not enough forward lean on the left. Let your torso tilt forward.",
                    "Deeper hinge on the left. Keep your back flat and push hips back."
                ]
            }
        },
        "right": {
            "hip_hinge": {
                "ideal_range": (95, 140),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Hinge forward more from your right hip. Push your hips back.",
                    "More forward lean on the right. Keep your spine straight.",
                    "Deeper hinge on the right. Bend from the hip, not the back."
                ]
            }
        }
    }
}



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
            "Great, I see your full body. Let's do the standing sky reach. Stand tall and raise one arm straight up toward the ceiling without shrugging your shoulders.",
            "Let's begin the sky reach. Keep your core tight and reach one arm straight overhead."
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
            "Perfect. For the side bend, keep your hips planted and gently drop your torso to the side."
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
            "Alright, let's move to standing arm abduction. Keep your torso completely straight and lift your arm exactly shoulder height."
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
            "Good positioning. For the standing row, really focus on squeezing your shoulder blades together as you pull your elbows back."
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
            "Let's begin standing knee raises. Lift one knee straight up toward your waist without leaning backwards."
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
            "Great, let's start marching in place. Keep a steady, confident rhythm and pump your knees."
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
            "I can see your full body perfectly. Let's do a supported squat. Keep your back completely tall, eyes forward, and sink down slowly.",
            "Get ready to squat. Hold a chair if you need it, and drop down while keeping your chest up proudly."
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
        "intro": [
            "Perfect. For the wall sit, bend your knees to ninety degrees and press your entire back flat against the wall."
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
            "We are ready for toe raises. Lock your knees tight and lift the front of your feet towards your shins."
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
            "Let's do standing forward leg raises. Keep your working leg completely straight and lift it forward slowly."
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
            "Time for heel to butt. Bend your knee completely backward and try to pull your heel directly into your glute."
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
            "Let's work those hamstrings. Keep your knees aligned with each other and curl your heel straight up."
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
            "Now for hip extensions. Keep your knee totally straight and push your leg backward, squeezing your glute."
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
            "Let's do some heel raises. Rise up high onto your toes while keeping your body perfectly tall."
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
            "Let's do a mini squat. Just a small bend in the knees, making sure you keep your chest up and back straight."
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
            "Standing hip abduction. Keep your upper body still and lift your leg straight out to the side."
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
            "Finally, wall push-ups. Lean against the wall and slowly bend your elbows to bring your chest close to the surface."
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
    }
}

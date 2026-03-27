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
        "is_hold_based": True,
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
    },

    # ─────────────────────────────────────────────────────────────
    # EARLY REHAB / SEATED EXERCISES
    # ─────────────────────────────────────────────────────────────

    "seated_knee_extension": {
        "intro": [
            "I can see you clearly. Let's start with seated knee extensions. Sit yourself tall on a chair with your feet flat on the floor. Keep your thigh firmly pressed against the seat. Now slowly straighten one leg out in front of you until it's completely locked straight. This is one of the best exercises for waking up your quadriceps after surgery or bed rest.",
            "Perfect position. For this exercise, I need you to sit up nice and tall with good posture. Keep your back against the chair. Now extend one knee fully, pushing your heel away from you until the leg is completely straight. Hold for a second at the top, then lower it slowly. No dropping it."
        ],
        "left": {
            "knee_extension": {
                "ideal_range": (165, 180),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your left leg is not fully straight yet. I need you to push your foot out further and really lock that knee out completely.",
                    "You are stopping short on the left side. Squeeze your quadricep hard and straighten that leg all the way until the knee is fully extended.",
                    "I can see your left knee still has a bend in it. Really push through and extend it completely. Imagine you are trying to kick something far away.",
                    "Almost there with the left leg. Just push through the last few degrees and lock it out tight."
                ]
            }
        },
        "right": {
            "knee_extension": {
                "ideal_range": (165, 180),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee is not extending all the way. Push your foot out further and squeeze your quad to fully lock that knee.",
                    "You are cutting the movement short on the right side. I need to see a perfectly straight leg at the top.",
                    "Straighten your right knee completely. Squeeze that quadricep muscle hard at the top and hold it for a beat.",
                    "Your right leg has a noticeable bend still. Push through the full range of motion and fully extend it."
                ]
            }
        }
    },

    "straight_leg_raise": {
        "intro": [
            "Now we are doing straight leg raises. This is excellent for your hip flexors and quad activation. Keep your knee completely locked and straight throughout the entire movement. Slowly lift the leg upward toward the ceiling. Control it on the way back down too, do not just drop it.",
            "Alright, straight leg raises. Lie on your back or sit back with support. Lock your knee out fully, then lift that entire leg straight up as one solid unit. The key here is to keep the knee locked the whole time. If it bends, you are losing the benefit. Slow and controlled."
        ],
        "left": {
            "hip_flexion": {
                "ideal_range": (120, 155),
                "keypoints": (11, 23, 25),
                "cues": [
                    "Your left leg is not coming up high enough. Keep that knee locked tight and lift the whole leg higher from the hip.",
                    "I need more height on the left side. Squeeze your quad to keep it straight and lift from your hip joint.",
                    "You are barely lifting your left leg off the surface. Push through the hip and raise it higher while keeping the knee completely stiff.",
                    "Try to bring your left leg up a good bit more. Think about reaching your heel toward the ceiling."
                ]
            }
        },
        "right": {
            "hip_flexion": {
                "ideal_range": (120, 155),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Your right leg needs to come up higher. Keep that knee perfectly locked and lift from the hip joint.",
                    "Not high enough on the right side. Squeeze your quad hard and raise the whole leg toward the ceiling.",
                    "Lift your right leg higher. I can see it hovering too low. Push through the hip and bring it up confidently.",
                    "More height on your right leg. Think about keeping it as stiff as a board and lifting the whole thing upward."
                ]
            }
        }
    },

    "sit_to_stand": {
        "intro": [
            "Great, let's do sit-to-stand. This is one of the most important functional exercises in rehabilitation. Start by sitting in a chair with your feet flat on the floor about shoulder-width apart. Lean your chest forward slightly, then drive through your heels to stand up. Try not to use your hands at all. Then sit back down slowly with control, do not just plop down.",
            "We are going to practice getting up from a chair. This builds real-world leg strength that you use every single day. Sit tall, shift your weight forward over your feet, and push up to standing without using your arms. Then lower yourself back down slowly. The slower you go, the more your legs are working."
        ],
        "both": {
            "knee_bend_left": {
                "ideal_range": (70, 110),
                "keypoints": (23, 25, 27),
                "cues": [
                    "You are not going low enough when you sit down. I need you to lower all the way until your bottom touches the chair. Control the descent.",
                    "Your left knee is not bending deep enough. Sit all the way back down into the chair before standing back up. Get that full range.",
                    "Slow down the sitting portion. Bend your knees much deeper and lower yourself with control instead of dropping quickly.",
                    "You are barely bending on the way down. I need to see a much deeper knee bend as you lower into the seat."
                ]
            },
            "knee_bend_right": {
                "ideal_range": (70, 110),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right side is cutting the movement short. Sit all the way back down to the chair before standing again.",
                    "Bend your right knee more as you lower into the chair. You are barely going down before popping back up.",
                    "I can see your right knee is not reaching the proper depth. Really sit back into that chair fully before you stand.",
                    "Take your time lowering down on the right side. Bend deeper into the chair to get the most out of this exercise."
                ]
            }
        }
    },

    # ─────────────────────────────────────────────────────────────
    # FUNCTIONAL STRENGTH & BALANCE (ADVANCED REHAB)
    # ─────────────────────────────────────────────────────────────

    "forward_lunge": {
        "intro": [
            "Let's move to forward lunges. This is an excellent exercise for building quad strength, glute power, and knee stability. Stand sideways to the camera with your feet together. Step one foot forward and lower your body until your front knee bends to about ninety degrees. Keep your chest up tall and your core tight throughout the entire movement. Push back to the starting position through your front heel.",
            "Time for lunges. Stand nice and tall, take a big step forward, and lower your back knee toward the ground. Your front thigh should end up roughly parallel with the floor. Make sure your front knee stays right above your ankle and does not shoot past your toes. Push back up with power."
        ],
        "left": {
            "front_knee_angle": {
                "ideal_range": (70, 115),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Your left knee is not bending deep enough in the lunge. Drop your hips lower until your left thigh is closer to parallel with the floor.",
                    "Sink deeper into the left lunge. I can see you are staying too high. Really bend that front knee and lower your center of gravity.",
                    "Bend your left knee more aggressively. You are barely dropping into the lunge position. Get your thigh parallel to the ground.",
                    "Not deep enough on the left side. Take a slightly bigger step and really drop your weight down into the lunge."
                ]
            }
        },
        "right": {
            "front_knee_angle": {
                "ideal_range": (70, 115),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee needs to bend further into the lunge. Drop your hips lower and really sink into the movement.",
                    "Sink deeper on the right side. I need to see your right thigh closer to parallel with the floor.",
                    "You are not hitting enough depth on the right lunge. Bend that front knee more and lower your hips toward the ground.",
                    "Step further forward with your right foot and really commit to dropping low into the lunge. Much more knee bend needed."
                ]
            }
        }
    },

    "side_lunge": {
        "intro": [
            "Side lunges now. This exercise strengthens your inner thighs, hips, and builds lateral stability that is critical for daily movement and fall prevention. Face the camera, then step one foot out wide to the side. Bend the stepping knee and sit your hips back as if you are sitting into a chair on one side. Keep the other leg straight. Push back to center when you are ready.",
            "Let's work on lateral strength with side lunges. Step wide to one side, bend that knee, and push your hips back behind you. Your weight should be loaded into the bent leg. The straight leg should stay fully extended with the foot flat on the floor. This builds hip strength and improves your lateral movement."
        ],
        "left": {
            "knee_bend": {
                "ideal_range": (85, 130),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Bend your left knee much deeper into the side lunge. You are barely lowering your hips. Sit back and load into that left leg.",
                    "Your left side lunge is too shallow. I need to see a much bigger knee bend with your hips pushed back behind you.",
                    "Drop lower on the left side. Push your hips back and really bend that left knee like you are sitting into a chair sideways.",
                    "You are staying too upright in the left side lunge. Send your hips back and bend the knee much deeper."
                ]
            }
        },
        "right": {
            "knee_bend": {
                "ideal_range": (85, 130),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Your right knee is not bending enough in the side lunge. Drop your hips lower and sit deeper into the right leg.",
                    "Push your hips back further and bend your right knee more. I can tell you are not loading the right leg properly.",
                    "Go much lower on the right side. Send your hips back and bend deep into that right knee to really feel the glutes working.",
                    "Your right side lunge needs more depth. Think about sitting into a low chair on your right side."
                ]
            }
        }
    },

    "step_back_knee_drive": {
        "intro": [
            "Step back knee drives are next. This exercise is fantastic for building balance, hip flexor strength, and coordination. Face the camera and stand tall. Step one leg backward behind you, then immediately drive that same knee forward and up toward your chest. Focus on keeping your balance on the standing leg. Control the movement, do not rush it.",
            "This one really challenges your balance and hip strength. You are going to step one foot behind you, then snap that same knee forward and up to waist height. Keep your core tight and your standing leg stable throughout. Think about pulling the knee up with your hip flexor muscles."
        ],
        "left": {
            "knee_drive": {
                "ideal_range": (60, 110),
                "keypoints": (23, 25, 27),
                "cues": [
                    "Drive your left knee much higher after the step back. I need to see it come up to at least waist level. Really push it up with power.",
                    "Your left knee drive is coming up way too low. Squeeze your hip flexor and bring that knee up toward your chest.",
                    "Lift your left knee higher on the return. You are barely raising it. Think about pulling your knee up as if something is pushing your thigh from below.",
                    "Not enough height on the left knee drive. Really snap that knee upward with purpose and conviction."
                ]
            }
        },
        "right": {
            "knee_drive": {
                "ideal_range": (60, 110),
                "keypoints": (24, 26, 28),
                "cues": [
                    "Drive your right knee significantly higher. I need to see it at waist level or above when you bring it forward.",
                    "Your right knee is not coming up high enough after the step back. Really explode that knee upward with your hip flexor.",
                    "More power on the right knee drive. Bring it up to your chest level and hold it there for a split second.",
                    "Your right side knee drive is too low. Focus on snapping that knee up high and controlled."
                ]
            }
        }
    },

    "single_leg_hip_hinge_supported": {
        "intro": [
            "Let's finish with the single leg hip hinge. This is one of the best functional rehab movements for your glutes and hamstrings. Hold a chair lightly with one hand for balance. Stand on one leg, then slowly hinge forward at the hip, sending your other leg behind you and your torso forward. Keep your back completely flat throughout the movement. Do not round your spine at all. Return to standing slowly.",
            "Single leg hip hinge with support. This targets the entire back of your body, your glutes, hamstrings, and lower back. Stand on one leg while lightly holding a chair. Hinge forward from the hip joint while keeping your back perfectly straight and flat. Imagine your body is a seesaw balanced on your standing hip. Go as far forward as you can without rounding your back, then come back up slowly."
        ],
        "left": {
            "hip_hinge": {
                "ideal_range": (95, 140),
                "keypoints": (11, 23, 25),
                "cues": [
                    "Hinge forward more from your left hip. You are standing way too upright. Push your hips back and let your torso tilt forward while keeping your back flat.",
                    "I am not seeing enough forward lean on the left side. Push your hips back behind you and let your upper body come forward naturally.",
                    "You need a deeper hinge on the left. Think about trying to make your torso parallel with the floor eventually. Keep pushing those hips back.",
                    "Your left hip hinge is too shallow. Send your hips further back and bend forward from the hip joint, not from your back."
                ]
            }
        },
        "right": {
            "hip_hinge": {
                "ideal_range": (95, 140),
                "keypoints": (12, 24, 26),
                "cues": [
                    "Hinge forward more from your right hip. You are barely tilting forward. Push your hips back and lean your torso forward with a flat back.",
                    "More forward lean needed on the right side. Think about pushing your hips as far back as possible while keeping your spine perfectly straight.",
                    "Deeper hinge on the right please. Keep that back completely flat and hinge further from the hip joint until you feel a stretch in your hamstring.",
                    "You are not getting enough depth on the right hip hinge. Send your right hip back further and allow your torso to come forward naturally."
                ]
            }
        }
    }
}



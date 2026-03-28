/**
 * FLEX Exercise Data — TypeScript mirror of exercise_config.py
 * Maps directly to the Python engine's EXERCISE_CONFIG keys.
 */

export interface ExerciseJoint {
  name: string;
  idealRange: [number, number];
  keypoints: [number, number, number];
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  description: string;
  targetJoints: string[];
  instructions: string[];
  duration: number; // default minutes
  joints: ExerciseJoint[];
  isHoldBased?: boolean;
  demoVideo?: string;
  image?: string;
}

export const EXERCISE_CATEGORIES = {
  "Upper Body & Mobility": "bg-maroon-100 text-maroon-800",
  "Lower Body Strength": "bg-amber-100 text-amber-800",
  "Balance & Stability": "bg-emerald-100 text-emerald-800",
  "Functional Strength": "bg-blue-100 text-blue-800",
} as const;

export const EXERCISES: Exercise[] = [
  // ── STANDING ARM / MOBILITY / POSTURE ──
  {
    id: "standing_sky_reach",
    name: "Standing Sky Reach",
    category: "Upper Body & Mobility",
    categoryColor: "bg-maroon-100 text-maroon-800",
    description: "Stand tall and raise one arm straight up toward the ceiling without shrugging your shoulders.",
    targetJoints: ["Shoulder Flexion", "Elbow Extension"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Keep your core engaged and spine neutral",
      "Raise one arm straight overhead, close to your ear",
      "Fully extend your elbow at the top",
      "Hold briefly, then lower with control",
    ],
    duration: 3,
    joints: [
      { name: "shoulder_flexion", idealRange: [160, 180], keypoints: [23, 11, 13] },
      { name: "elbow_extension", idealRange: [160, 180], keypoints: [11, 13, 15] },
    ],
  },
  {
    id: "standing_side_bend_reach",
    name: "Standing Side Bend",
    category: "Upper Body & Mobility",
    categoryColor: "bg-maroon-100 text-maroon-800",
    description: "Keep your hips planted and gently drop your torso to the side for a lateral stretch.",
    targetJoints: ["Trunk Lateral Flexion"],
    instructions: [
      "Stand tall with feet hip-width apart",
      "Keep your hips perfectly still",
      "Slowly lean to one side, reaching overhead",
      "Feel the stretch along your obliques",
    ],
    duration: 3,
    joints: [
      { name: "trunk_lateral_flexion", idealRange: [115, 140], keypoints: [25, 23, 11] },
    ],
  },
  {
    id: "standing_arm_abduction",
    name: "Standing Arm Abduction",
    category: "Upper Body & Mobility",
    categoryColor: "bg-maroon-100 text-maroon-800",
    description: "Keep your torso completely straight and lift your arm to exactly shoulder height.",
    targetJoints: ["Shoulder Abduction"],
    instructions: [
      "Stand with arms at your sides",
      "Lift one arm straight out to the side",
      "Stop at shoulder height (90 degrees)",
      "Keep your torso perfectly upright",
    ],
    duration: 3,
    joints: [
      { name: "shoulder_abduction", idealRange: [80, 110], keypoints: [23, 11, 13] },
    ],
  },
  {
    id: "standing_row_pull",
    name: "Standing Row Pull",
    category: "Upper Body & Mobility",
    categoryColor: "bg-maroon-100 text-maroon-800",
    description: "Squeeze your shoulder blades together as you pull your elbows back.",
    targetJoints: ["Elbow Flexion (L)", "Elbow Flexion (R)"],
    instructions: [
      "Stand with arms extended in front",
      "Pull both elbows back behind your torso",
      "Squeeze your shoulder blades together",
      "Hold the squeeze, then release slowly",
    ],
    duration: 3,
    joints: [
      { name: "elbow_flexion_left", idealRange: [50, 105], keypoints: [11, 13, 15] },
      { name: "elbow_flexion_right", idealRange: [50, 105], keypoints: [12, 14, 16] },
    ],
  },
  // ── STANDING LEG STRENGTH ──
  {
    id: "standing_knee_raise",
    name: "Standing Knee Raise",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Lift one knee straight up toward your waist without leaning backwards.",
    targetJoints: ["Knee Flexion"],
    instructions: [
      "Stand on one leg with good balance",
      "Drive the other knee upward",
      "Aim for thigh parallel to the ground",
      "Keep your torso upright throughout",
    ],
    duration: 4,
    joints: [
      { name: "knee_flexion", idealRange: [60, 110], keypoints: [23, 25, 27] },
    ],
  },
  {
    id: "standing_marching",
    name: "Standing Marching",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "March in place with a steady rhythm and high knees.",
    targetJoints: ["Knee Raise"],
    instructions: [
      "Stand tall with core engaged",
      "March in place, alternating legs",
      "Lift each knee to hip height",
      "Keep a steady, confident rhythm",
    ],
    duration: 4,
    joints: [
      { name: "knee_raise", idealRange: [60, 115], keypoints: [23, 25, 27] },
    ],
  },
  {
    id: "supported_squat",
    name: "Supported Squat",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Keep your back tall, eyes forward, and sink into a deep squat with control.",
    targetJoints: ["Knee Angle (L)", "Knee Angle (R)", "Back Posture"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold a chair or wall if needed",
      "Slowly lower by bending your knees",
      "Keep your chest up and back straight",
      "Lower until thighs are parallel to the floor",
    ],
    duration: 5,
    joints: [
      { name: "knee_angle_left", idealRange: [70, 105], keypoints: [23, 25, 27] },
      { name: "knee_angle_right", idealRange: [70, 105], keypoints: [24, 26, 28] },
      { name: "back_posture", idealRange: [80, 145], keypoints: [11, 23, 25] },
    ],
  },
  {
    id: "wall_sit",
    name: "Wall Sit",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Bend your knees to 90 degrees and press your back flat against the wall.",
    targetJoints: ["Knee Angle (L)", "Knee Angle (R)"],
    instructions: [
      "Lean your back against a wall",
      "Slide down until knees hit 90 degrees",
      "Keep your entire back flat on the wall",
      "Hold the position as long as possible",
    ],
    duration: 3,
    isHoldBased: true,
    demoVideo: "/videodemos/wall_sit.mp4",
    image: "/images/wall_sit.png",
    joints: [
      { name: "knee_angle_left", idealRange: [80, 110], keypoints: [23, 25, 27] },
      { name: "knee_angle_right", idealRange: [80, 110], keypoints: [24, 26, 28] },
    ],
  },
  {
    id: "standing_toe_raises",
    name: "Standing Toe Raises",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Lock your knees tight and lift front of feet towards shins.",
    targetJoints: ["Knee Lock (L)", "Knee Lock (R)"],
    instructions: [
      "Stand with feet flat on the floor",
      "Keep both knees perfectly locked straight",
      "Lift toes toward your shins",
      "Hold briefly then lower with control",
    ],
    duration: 3,
    joints: [
      { name: "knee_lock_left", idealRange: [160, 180], keypoints: [23, 25, 27] },
      { name: "knee_lock_right", idealRange: [160, 180], keypoints: [24, 26, 28] },
    ],
  },
  {
    id: "standing_forward_leg_raise",
    name: "Forward Leg Raise",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Keep your working leg completely straight and lift it forward slowly.",
    targetJoints: ["Hip Flexion"],
    instructions: [
      "Stand on one leg with support if needed",
      "Keep the working leg straight",
      "Lift it forward in a controlled motion",
      "Squeeze your quad at the top",
    ],
    duration: 3,
    joints: [
      { name: "hip_flexion", idealRange: [130, 165], keypoints: [11, 23, 25] },
    ],
  },
  {
    id: "standing_heel_to_butt",
    name: "Heel to Butt",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Bend your knee backward and pull your heel directly into your glute.",
    targetJoints: ["Knee Flexion"],
    instructions: [
      "Stand on one leg",
      "Bend the other knee fully backward",
      "Pull your heel toward your glute",
      "Keep your standing leg stable",
    ],
    duration: 3,
    joints: [
      { name: "knee_flexion", idealRange: [30, 90], keypoints: [23, 25, 27] },
    ],
  },
  {
    id: "standing_hamstring_curl",
    name: "Hamstring Curl",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Keep your knees aligned and curl your heel straight up.",
    targetJoints: ["Knee Flexion"],
    instructions: [
      "Stand with knees aligned together",
      "Curl one heel upward behind you",
      "Squeeze your hamstring at the top",
      "Lower slowly with control",
    ],
    duration: 3,
    joints: [
      { name: "knee_flexion", idealRange: [45, 100], keypoints: [23, 25, 27] },
    ],
  },
  {
    id: "standing_hip_extension",
    name: "Hip Extension",
    category: "Lower Body Strength",
    categoryColor: "bg-amber-100 text-amber-800",
    description: "Keep your knee straight and push your leg backward, squeezing the glute.",
    targetJoints: ["Hip Extension"],
    instructions: [
      "Stand tall holding support",
      "Keep the working leg straight",
      "Push the leg directly backward",
      "Squeeze your glute at the peak",
    ],
    duration: 3,
    joints: [
      { name: "hip_extension", idealRange: [160, 185], keypoints: [11, 23, 25] },
    ],
  },
  // ── BALANCE & STABILITY ──
  {
    id: "standing_heel_raises",
    name: "Heel Raises",
    category: "Balance & Stability",
    categoryColor: "bg-emerald-100 text-emerald-800",
    description: "Rise high onto your toes while keeping your body perfectly tall.",
    targetJoints: ["Ankle Extension (L)", "Ankle Extension (R)"],
    instructions: [
      "Stand with feet hip-width apart",
      "Rise up onto your tiptoes",
      "Push hard through your calves",
      "Hold at the top, then lower slowly",
    ],
    duration: 3,
    joints: [
      { name: "ankle_extension_left", idealRange: [140, 165], keypoints: [25, 27, 31] },
      { name: "ankle_extension_right", idealRange: [140, 165], keypoints: [26, 28, 32] },
    ],
  },
  {
    id: "mini_squat",
    name: "Mini Squat",
    category: "Balance & Stability",
    categoryColor: "bg-emerald-100 text-emerald-800",
    description: "A small bend in the knees while keeping chest up and back straight.",
    targetJoints: ["Knee Angle (L)", "Knee Angle (R)"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Bend knees slightly (partial squat)",
      "Keep your chest up and back straight",
      "Only go down about one quarter of the way",
    ],
    duration: 3,
    joints: [
      { name: "knee_angle_left", idealRange: [140, 165], keypoints: [23, 25, 27] },
      { name: "knee_angle_right", idealRange: [140, 165], keypoints: [24, 26, 28] },
    ],
  },
  {
    id: "standing_hip_abduction",
    name: "Hip Abduction",
    category: "Balance & Stability",
    categoryColor: "bg-emerald-100 text-emerald-800",
    description: "Keep your upper body still and lift your leg straight out to the side.",
    targetJoints: ["Hip Abduction"],
    instructions: [
      "Stand on one leg with wall support",
      "Keep your upper body perfectly still",
      "Lift the other leg out to the side",
      "Don't lean your torso",
    ],
    duration: 3,
    joints: [
      { name: "hip_abduction", idealRange: [150, 175], keypoints: [11, 23, 25] },
    ],
  },
  {
    id: "wall_push_ups",
    name: "Wall Push-ups",
    category: "Upper Body & Mobility",
    categoryColor: "bg-maroon-100 text-maroon-800",
    description: "Lean against the wall and slowly bend your elbows to bring your chest close.",
    targetJoints: ["Elbow Angle (L)", "Elbow Angle (R)"],
    instructions: [
      "Stand arm's length from a wall",
      "Place palms flat on the wall",
      "Bend elbows to bring chest toward wall",
      "Push back out to straight arms",
    ],
    duration: 4,
    joints: [
      { name: "elbow_angle_left", idealRange: [60, 110], keypoints: [11, 13, 15] },
      { name: "elbow_angle_right", idealRange: [60, 110], keypoints: [12, 14, 16] },
    ],
  },
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function getExercisesByCategory(category: string): Exercise[] {
  return EXERCISES.filter((e) => e.category === category);
}

export const CATEGORY_LIST = [
  "Upper Body & Mobility",
  "Lower Body Strength",
  "Balance & Stability",
] as const;

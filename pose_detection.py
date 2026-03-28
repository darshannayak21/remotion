import cv2
import mediapipe as mp
import numpy as np

class PoseDetector:
    """
    Real-time MediaPipe Pose wrapper for the FLEX system.
    Runs at model_complexity 1 or 2 depending on performance needs.
    """
    def __init__(self, use_high_accuracy: bool = True):
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        complexity = 2 if use_high_accuracy else 1
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=complexity,
            smooth_landmarks=True,
            enable_segmentation=False,
            min_detection_confidence=0.75,
            min_tracking_confidence=0.75
        )

    def process_frame(self, frame: np.ndarray):
        """
        Takes BGR frame, returns MediaPipe pose results.
        """
        # Convert BGR to RGB for processing
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        
        results = self.pose.process(image_rgb)
        
        return results

    def extract_landmarks(self, results):
        """
        Extracts native normalized landmarks and a numpy array of visibility scores.
        """
        if not results or not results.pose_landmarks:
            return None, None
            
        landmarks = results.pose_landmarks.landmark
        vis_scores = np.array([lm.visibility for lm in landmarks])
        return landmarks, vis_scores

    def get_landmark_coords(self, landmarks, width: int, height: int):
        """
        Converts normalized landmarks to pixel coordinates.
        """
        if not landmarks:
            return []
            
        coords = []
        for lm in landmarks:
            cx, cy = int(lm.x * width), int(lm.y * height)
            coords.append((cx, cy))
        return coords

    def draw_skeleton(self, frame: np.ndarray, results):
        """
        Utility for basic skeleton rendering if custom drawing isn't used.
        """
        if results and results.pose_landmarks:
            self.mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=self.mp_drawing_styles.get_default_pose_landmarks_style()
            )
        return frame
        
    def close(self):
        self.pose.close()


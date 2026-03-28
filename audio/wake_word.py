import threading
import time
from typing import Callable

try:
    import speech_recognition as sr
    HAS_SR = True
except ImportError:
    HAS_SR = False

class WakeWordEngine:
    """
    Background hotword detection using SpeechRecognition.
    Listens for 'flex'.
    Triggers callback when detected.
    """
    def __init__(self, callback: Callable):
        self.callback = callback
        self.is_listening = False
        self.recognizer = None
        self.mic = None
        self.stop_listening_fn = None

    def get_correct_mic_index(self):
        try:
            mics = sr.Microphone.list_microphone_names()
            for i, name in enumerate(mics):
                name_lower = name.lower()
                if "iriun" in name_lower:
                    continue
                if "array" in name_lower or "intel" in name_lower:
                    print(f"[WakeWord] Explicitly selected mic: '{name}'")
                    return i
            print("[WakeWord] Could not find 'Microphone Array'. Defaulting.")
            return None
        except Exception:
            return None

    def start(self):
        if not HAS_SR:
            print("[WakeWord] Error: SpeechRecognition not installed. Cannot start wake word engine.")
            return

        try:
            self.recognizer = sr.Recognizer()
            self.recognizer.energy_threshold = 300 # Dynamic adjusts later
            self.recognizer.dynamic_energy_threshold = True

            mic_index = self.get_correct_mic_index()
            self.mic = sr.Microphone(device_index=mic_index)
            
            with self.mic as source:
                print("[WakeWord] Adjusting for ambient noise for 1 second...")
                self.recognizer.adjust_for_ambient_noise(source, duration=1.0)
                
            self.is_listening = True
            
            # listen_in_background runs in a daemon thread natively and calls _audio_callback
            self.stop_listening_fn = self.recognizer.listen_in_background(
                self.mic, 
                self._audio_callback
            )
            print("[WakeWord] Google Speech Recognition listening for 'flex' in background...")

        except Exception as e:
            print(f"[WakeWord] Initialization failed: {e}")

    def stop(self):
        self.is_listening = False
        if self.stop_listening_fn:
            self.stop_listening_fn(wait_for_stop=False)

    def _audio_callback(self, recognizer, audio):
        if not self.is_listening:
            return
            
        try:
            # We use the fast and highly accurate google STT
            text = recognizer.recognize_google(audio).lower()
            print(f"[WakeWord] Heard: '{text}'")
            
            if "flex" in text:
                print("[WakeWord] Triggered 'flex'!")
                self.callback()
                
        except sr.UnknownValueError:
            pass # Unrecognized speech, normal for background noise
        except sr.RequestError as e:
            print(f"[WakeWord] API unavailable: {e}")

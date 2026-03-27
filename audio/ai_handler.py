import os
import json
import time
from typing import Any
from system_prompt import get_conversational_prompt, get_escalation_prompt, get_live_coaching_prompt # type: ignore

try:
    import speech_recognition as sr # type: ignore
    HAS_SR = True
except ImportError:
    HAS_SR = False

try:
    from groq import Groq # type: ignore
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False

class AIHandler:
    """
    Handles robust microphone capture using SpeechRecognition's VAD, 
    and feeds the structured context to GROQ (Llama 3) for blazing-fast responses.
    """
    def __init__(self, user_name: str = "User"):
        self.user_name = user_name
        self.groq_key = os.getenv("GROQ_API_KEY")
        
        if self.groq_key and self.groq_key != "your_key" and HAS_GROQ:
            # Replaced Gemini due to strict regional Free-Tier limits ("limit: 0").
            self.groq_client = Groq(api_key=self.groq_key)
            self.model_name = "llama-3.3-70b-versatile" # Upgraded for heavy conversational reasoning
        else:
            self.groq_client = None
            
        self.recognizer = sr.Recognizer() if HAS_SR else None
        if self.recognizer:
            self.recognizer.pause_threshold = 1.5 # type: ignore
            self.recognizer.energy_threshold = 400 # type: ignore
            self.recognizer.dynamic_energy_threshold = True # type: ignore
            self.recognizer.dynamic_energy_ratio = 2.0 # type: ignore

    def get_correct_mic_index(self):
        if not HAS_SR: return None
        try:
            mics = sr.Microphone.list_microphone_names()
            for i, name in enumerate(mics):
                name_lower = name.lower()
                if "iriun" in name_lower: continue
                if "array" in name_lower or "intel" in name_lower:
                    return i
            return None
        except Exception:
            return None

    def capture_robust_speech(self) -> str:
        """Uses SpeechRecognition to listen for user input until they stop talking."""
        if not HAS_SR:
            print("[AI] SpeechRecognition not installed.")
            return ""

        mic_index = self.get_correct_mic_index()
        
        try:
            with sr.Microphone(device_index=mic_index) as source:
                print("[AI] Adjusting ambient noise for 1.0s...")
                self.recognizer.adjust_for_ambient_noise(source, duration=1.0) # type: ignore
                
                print("[AI] Listening for your question...")
                audio = self.recognizer.listen(source, timeout=12.0, phrase_time_limit=25.0) # type: ignore
                
            print("[AI] Recognizing speech...")
            text = self.recognizer.recognize_google(audio) # type: ignore
            return text
            
        except sr.WaitTimeoutError:
            print("[AI] No speech detected for 12 seconds.")
            return "TIMEOUT"
        except sr.UnknownValueError:
            print("[AI] Speech unintelligible.")
            return ""
        except sr.RequestError as e:
            print(f"[AI] API Error: {e}")
            return ""
        except Exception as e:
            print(f"[AI] Unexpected Mic Error: {e}")
            return ""

    def get_gemini_conversational(self, user_query: str, current_context: dict, exercise_name: str) -> str:
        if not self.groq_client: return "GROQ_API_KEY is missing. Please paste one into your .env file."
        
        system_instructions = get_conversational_prompt(self.user_name)
        live_context_str = f"Live Posture Telemetry:\n{json.dumps(current_context, indent=2)}\n\n"
        full_query = f"[SYSTEM INFO] {self.user_name}'s Current Assigned Target Exercise: {exercise_name.upper()}.\n\n" + live_context_str + f"{self.user_name} just told you: " + user_query

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_instructions},
                    {"role": "user", "content": full_query}
                ],
                model=self.model_name,
                temperature=0.8,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"[AI] Llama Error: {e}")
            return "I had trouble analyzing that request. Let's try again."

    def get_gemini_escalation(self, current_context: dict) -> str:
        if not self.groq_client: return "GROQ_API_KEY is missing. Please paste one into your .env file."

        system_instructions = get_escalation_prompt(self.user_name)
        live_context_str = f"Live Errors Detected:\n{json.dumps(current_context.get('errors', []), indent=2)}\n\n"
        full_query = live_context_str + f"{self.user_name} is struggling. Provide brief escalation guidance right now."

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_instructions},
                    {"role": "user", "content": full_query}
                ],
                model=self.model_name,
                temperature=0.4,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"[AI] Llama Error: {e}")
            return "Try to adjust your posture according to the previous warnings."

    def get_gemini_live_cue(self, error: dict, current_context: dict) -> str:
        if not self.groq_client: return error.get("cues", ["Adjust your position."])[0]

        system_instructions = get_live_coaching_prompt(current_context, self.user_name)
        query = f"Target Error to Correct: {error['joint']}. Formulate ONE short, actionable coaching command right now."

        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_instructions},
                    {"role": "user", "content": query}
                ],
                model=self.model_name,
                temperature=0.7,
                max_tokens=50
            )
            return chat_completion.choices[0].message.content.replace("\n", "").strip()
        except Exception as e:
            return error.get("cues", ["Adjust your position."])[0]

    def execute_conversational_loop(self, state_manager, context_getter, voice_engine, exercise_name: str) -> None:
        from state_manager import SystemMode # type: ignore

        state_manager.set_mode(SystemMode.SPEAKING)
        voice_engine.speak(f"Yes {self.user_name}, how may I help you?", block=True)
        
        last_interaction_time = time.time()
        
        while state_manager.is_ai_active():
            # Hard fallback: if stuck without a successful transcription for 15 seconds, exit.
            if time.time() - last_interaction_time > 15.0:
                print("[AI] Hard idle timeout reached. Returning to coaching.")
                state_manager.set_mode(SystemMode.ACTIVE_COACHING)
                break

            state_manager.set_mode(SystemMode.LISTENING)
            
            query = self.capture_robust_speech()
            if query == "TIMEOUT":
                print("[AI] Session module timed out. Returning to coaching.")
                state_manager.set_mode(SystemMode.ACTIVE_COACHING)
                break
                
            if not query: 
                # Note: Unintelligible noise does NOT reset the timer. Loop will naturally die at 15s.
                continue
                
            # Reset timer upon successfully hearing the user
            last_interaction_time = time.time()
                
            print(f"[AI] User transcribed: '{query}'")

            state_manager.set_mode(SystemMode.SPEAKING)
            live_context = context_getter()
            answer = self.get_gemini_conversational(query, live_context, exercise_name)
            print(f"[AI] FLEX replied: {answer}")
            voice_engine.speak(answer, block=True)
            
            # Reset timer again after the AI finishes speaking
            last_interaction_time = time.time()

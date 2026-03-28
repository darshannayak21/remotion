import os
import threading
import queue
import time
import asyncio
import tempfile
import edge_tts
import pygame
import requests
from dotenv import load_dotenv

HAS_DEEPGRAM = True  # We will use native requests instead of the SDK

class VoiceEngine:
    """
    Asynchronous, non-blocking voice engine for FLEX.
    Uses Deepgram Aura (primary) or edge-tts (fallback) to generate natural voice.
    """
    def __init__(self, voice="aura-asteria-en"):
        # If the voice string looks like a Deepgram model, use Deepgram if available
        self.preferred_voice = voice
        self.deepgram_key = os.getenv("DEEPGRAM_API_KEY")
        self.task_queue = queue.Queue()
        self.is_playing = False
        
        # Initialize Deepgram client if key exists
        self.dg_client = True if self.deepgram_key else False
        if self.dg_client:
            print(f"[VoiceEngine] Deepgram Aura REST Initialized (Voice: {self.preferred_voice})")

        # Initialize pygame mixer for fast, async audio playback
        pygame.mixer.init()
        
        # Start the background worker
        self.worker_thread = threading.Thread(target=self._worker, daemon=True)
        self.worker_thread.start()

    def speak(self, text: str, block: bool = False):
        """Public method to enqueue a speech task."""
        if not text: return
        self.task_queue.put(text)
        if block:
            self.wait_until_done()

    def stop(self):
        """Immediately halts any speech playing and clears the queue."""
        pygame.mixer.music.stop()
        self.is_playing = False
        with self.task_queue.mutex:
            self.task_queue.queue.clear()

    def wait_until_done(self):
        """Blocks the calling thread until all audio finishes playing."""
        while self.is_playing or not self.task_queue.empty():
            time.sleep(0.05)

    def _worker(self):
        """Background thread that pulls from queue and processes TTS."""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        while True:
            try:
                text = self.task_queue.get()
                if not text:
                    continue
                
                self.is_playing = True
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
                temp_file_path = temp_file.name
                temp_file.close()
                
                # ── Choose Backend ──
                success = False
                if self.dg_client and "aura-" in self.preferred_voice:
                    try:
                        url = f"https://api.deepgram.com/v1/speak?model={self.preferred_voice}"
                        headers = {
                            "Authorization": f"Token {self.deepgram_key}",
                            "Content-Type": "application/json"
                        }
                        payload = {"text": text}
                        
                        response = requests.post(url, headers=headers, json=payload, timeout=10)
                        response.raise_for_status()
                        
                        with open(temp_file_path, "wb") as f:
                            f.write(response.content)
                            
                        success = True
                    except Exception as e:
                        print(f"[VoiceEngine] Deepgram Aura REST Error: {e}. Falling back to edge-tts.")
                
                if not success:
                    # Fallback or User choice: edge-tts
                    # Map aura names to edge-tts if needed, or just use a generic one
                    fallback_voice = "en-US-AriaNeural"
                    communicate = edge_tts.Communicate(text, fallback_voice)
                    loop.run_until_complete(communicate.save(temp_file_path))
                
                # Play audio
                self._play_audio(temp_file_path)
                
                # Cleanup
                try:
                    os.remove(temp_file_path)
                except:
                    pass
                    
            except Exception as e:
                print(f"[VoiceEngine] Error: {e}")
            finally:
                self.is_playing = False
                self.task_queue.task_done()

    def _play_audio(self, file_path):
        """Blocks the internal worker thread until audio is fully played."""
        try:
            pygame.mixer.music.load(file_path)
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                time.sleep(0.02)
        except Exception as e:
            print(f"[VoiceEngine] Playback error: {e}")

import threading
from enum import Enum

class SystemMode(Enum):
    IDLE = 1
    BODY_DETECTED = 2
    STARTING_EXERCISE = 3
    ACTIVE_COACHING = 4
    LISTENING = 5
    SPEAKING = 6

class FlexStateManager:
    """
    Thread-safe state manager to control the flow of the FLEX assistant.
    The main CV loop and background Audio/AI threads read and modify this.
    """
    def __init__(self):
        self._mode = SystemMode.IDLE
        self._lock = threading.Lock()
        
    @property
    def current_mode(self) -> SystemMode:
        with self._lock:
            return self._mode
            
    def set_mode(self, new_mode: SystemMode):
        with self._lock:
            if self._mode != new_mode:
                print(f"[StateManager] Transitioning: {self._mode.name} -> {new_mode.name}")
                self._mode = new_mode

    def is_ai_active(self) -> bool:
        with self._lock:
            return self._mode in [SystemMode.LISTENING, SystemMode.SPEAKING]
            
    def is_coaching_active(self) -> bool:
        with self._lock:
            return self._mode == SystemMode.ACTIVE_COACHING

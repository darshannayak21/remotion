# FLEX AI Physiotherapy System

## Project Structure

This project consists of two perfectly integrated parts: the **Core AI Engine** (Python) and the **Web Application** (Next.js).

### 1. Web Application (`/web/`)
The modern, user-facing frontend built with Next.js, React, and Tailwind CSS.
- Handles all user interactions, custom routine creation, and workout session state.
- Takes the **exercise chosen by the user in the UI** and automatically sends it to the Python engine.

### 2. Core AI Engine (`/`) (Root Folder)
The pure computer vision and AI logic that processes camera feeds and speaks to the user.
- **`main_flex.py`**: The core logic class (`FlexSystem`) that manages Mediapipe pose detection, Gemini AI coaching, and Voice output. **(The old terminal menu has been removed—this file is now strictly driven by the Web App!)**
- **`api_server.py`**: The bridge file. The Web App starts this server in the background to dynamically load `main_flex.py` and stream the camera feed directly into your browser window.
- **`/exercises/`**: Contains the physical configurations algorithms for each specific movement.
- **`/audio/`**: Contains Wake-Word and internal TTS logic.

## How to Run the System

You do **not** need to run any Python scripts manually anymore. The Web App handles everything!

1. Open PowerShell.
2. Navigate to the web folder: `cd d:\pose\web`
3. Start the system: `npm run dev`

*(The frontend will automatically wake up the Python environment, start the AI engine bridge, and display the camera inside your browser!)*

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import shutil
import os
import re

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serve React frontend (build folder) as static files
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")


# Enable CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def serve_react_app():
    with open(os.path.join("frontend/build", "index.html")) as f:
        return HTMLResponse(content=f.read())

@app.get("/error")
async def serve_error_page():
    return {"error": "An error occurred"}

def sanitize_filename(filename: str) -> str:
    # Remove any character that's not alphanumeric, a dash, underscore, or dot
    return re.sub(r'[^A-Za-z0-9_.-]', '_', filename)

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...), language: str = Form(...)):
    try:
        # Save the uploaded file temporarily
        safe_filename = sanitize_filename(file.filename)
        temp_path = f"temp_{safe_filename}"
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with open(temp_path, "rb") as f:
            files = {
                'file': f,
                'language': (None, language),
                'vtt': (None, 'true'),
            }
            response = requests.post('https://asr.iitm.ac.in/internal/asr/decode', files=files)
            response.raise_for_status()

        os.remove(temp_path)
        # print(response.json())
        return JSONResponse(content={
            "response": response.json(),
            # "duration": duration  # Return the duration of the audio
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


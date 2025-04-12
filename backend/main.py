import os
import tempfile

from core.agent import Agent
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from google import genai

import uvicorn

load_dotenv()

app = FastAPI()


system_instruction="You are an indian msme grant finder assistant"

# Configure Gemini client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
agent = Agent(os.getenv("GOOGLE_API_KEY"))


@app.post("/translate")
async def translate(request: Request):
    try:
        print("Received translation request")

        body = await request.json()
        user_message = body.get("message")
        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")

        response = agent.translate(user_message)
        return JSONResponse(content={"response": response})
    except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/transcribe")
async def transcribe(request: Request):

    # Read the raw binary data from the request
    body = await request.body()

    # Save to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(body)
        tmp_path = tmp.name

    try:
        response, language = agent.translate_audio(tmp_path)
        return JSONResponse(content={"response": response, "language": language})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/message")
async def message(request: Request):
    try:
        print("Received message request")
        # Parse the JSON body
        body = await request.json()
        user_message = body.get("message")

        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")
    
        response, language = agent.transliterate_and_query(user_message)
        return JSONResponse(content={"response": response, "language": language})
    
    except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
    

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
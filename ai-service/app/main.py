import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

load_dotenv()


# =========================================================
# ENVIRONMENT VARIABLES
# =========================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://dev-flow-dwve5i1kz-hack-tech.vercel.app"
)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="DevFlow X AI Service",
    description="FastAPI AI backend for DevFlow X",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

allowed_origins = [
    # Current Vercel frontend
    "https://dev-flow-dwve5i1kz-hack-tech.vercel.app",

    # Previous Vercel frontend
    "https://dev-flow-x.vercel.app",

    # Environment variable
    FRONTEND_URL,

    # Local development
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Remove empty and duplicate values
allowed_origins = list(
    set(
        origin
        for origin in allowed_origins
        if origin
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# GROQ CLIENT
# =========================================================

groq_client = None

if GROQ_API_KEY:
    groq_client = Groq(
        api_key=GROQ_API_KEY
    )


# =========================================================
# REQUEST MODELS
# =========================================================

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


class AskRequest(BaseModel):
    question: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    success: bool
    answer: str


# =========================================================
# SYSTEM PROMPT
# =========================================================

SYSTEM_PROMPT = """
You are DevFlow X AI Assistant.

You are a helpful AI assistant for software developers and students.

Your responsibilities:

1. Explain programming concepts in simple language.
2. Help with Java, Python, JavaScript, React, Node.js,
   FastAPI, APIs, databases and Git.
3. Help users debug programming errors.
4. Provide step-by-step solutions.
5. Help students understand technical concepts.
6. Provide clean and beginner-friendly code.
7. Explain code line by line when requested.
8. Avoid unnecessary complexity.
9. If the user asks for code, provide working code.
10. Be concise but useful.

Always try to make technical topics easy to understand.
"""


# =========================================================
# GROQ CONFIGURATION
# =========================================================

def check_groq_configuration():

    if not GROQ_API_KEY:
        return False, "GROQ_API_KEY is not configured."

    if groq_client is None:
        return False, "Groq client is not initialized."

    return True, "Groq is configured."


# =========================================================
# AI RESPONSE FUNCTION
# =========================================================

def generate_ai_response(
    message: str,
    history: Optional[List[ChatMessage]] = None
):

    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured on the server."
        )

    if groq_client is None:
        raise HTTPException(
            status_code=500,
            detail="Groq client is not initialized."
        )

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    # Add previous conversation
    if history:

        for item in history:

            if item.role in ["user", "assistant"]:

                messages.append(
                    {
                        "role": item.role,
                        "content": item.content
                    }
                )

    # Add current question
    messages.append(
        {
            "role": "user",
            "content": message
        }
    )

    try:

        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.4,
            max_tokens=1200
        )

        answer = response.choices[0].message.content

        if not answer:
            answer = "Sorry, I could not generate a response."

        return answer

    except Exception as error:

        print("Groq API Error:", error)

        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(error)}"
        )


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "success": True,
        "message": "DevFlow X AI Service is running",
        "status": "online",
        "service": "FastAPI",
        "version": "1.0.0"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    groq_ok, groq_message = check_groq_configuration()

    return {
        "success": True,
        "service": "FastAPI",
        "status": "healthy",
        "groq_configured": groq_ok,
        "groq_message": groq_message
    }


# =========================================================
# TEST FASTAPI
# =========================================================

@app.get("/api/test-fastapi")
def test_fastapi():

    return {
        "success": True,
        "message": "FastAPI connection successful",
        "service": "FastAPI",
        "status": "online"
    }


# =========================================================
# AI HEALTH
# =========================================================

@app.get("/api/ai/health")
def ai_health():

    groq_ok, groq_message = check_groq_configuration()

    return {
        "success": True,
        "service": "AI",
        "status": "ready" if groq_ok else "not_ready",
        "groq_configured": groq_ok,
        "message": groq_message
    }


# =========================================================
# AI ASK
# =========================================================

@app.post("/api/ai/ask")
def ask_ai(request: AskRequest):

    if not request.question.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    answer = generate_ai_response(
        request.question,
        request.history
    )

    return {
        "success": True,
        "question": request.question,
        "answer": answer
    }


# =========================================================
# AI CHAT
# =========================================================

@app.post("/api/ai/chat")
def chat_ai(request: ChatRequest):

    if not request.message.strip():

        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    answer = generate_ai_response(
        request.message,
        request.history
    )

    return {
        "success": True,
        "message": request.message,
        "answer": answer
    }


# =========================================================
# RUN LOCALLY
# =========================================================

if __name__ == "__main__":

    import uvicorn

    port = int(
        os.getenv(
            "PORT",
            "8000"
        )
    )

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )

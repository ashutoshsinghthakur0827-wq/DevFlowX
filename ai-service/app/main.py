import os
import traceback
from typing import List, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq


# ============================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://dev-flow-x.vercel.app"
)


# ============================================================
# 2. FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="DevFlow X AI Service",
    description="AI assistant backend for DevFlow X",
    version="1.0.0",
)


# ============================================================
# 3. GROQ CLIENT
# ============================================================

client = None

if GROQ_API_KEY:
    client = Groq(
        api_key=GROQ_API_KEY
    )


# ============================================================
# 4. CORS CONFIGURATION
# ============================================================

allowed_origins = [
    # Production frontend
    "https://dev-flow-x.vercel.app",

    # Environment variable frontend
    FRONTEND_URL,

    # Local development
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


# Remove empty values and duplicates
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


# ============================================================
# 5. PYDANTIC MODELS
# ============================================================

class ChatMessage(BaseModel):

    role: Literal[
        "user",
        "assistant"
    ]

    content: str = Field(
        ...,
        min_length=1,
        max_length=8000
    )


class ChatRequest(BaseModel):

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000
    )

    history: List[ChatMessage] = Field(
        default_factory=list
    )


class AskRequest(BaseModel):

    question: str = Field(
        ...,
        min_length=1,
        max_length=4000
    )

    history: List[ChatMessage] = Field(
        default_factory=list
    )


class ChatResponse(BaseModel):

    reply: str

    model: str


# ============================================================
# 6. SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are DevFlow X AI Assistant.

DevFlow X is a software engineering management platform.

Technology stack:

- React
- JavaScript
- Node.js
- Express.js
- MongoDB
- FastAPI
- Python
- Groq API
- AI Agents
- RAG
- Software Project Management

Your responsibilities:

1. Explain programming concepts in simple language.
2. Help beginners learn MERN stack development.
3. Explain React, JavaScript, Python, FastAPI and MongoDB.
4. Help debug coding errors.
5. Suggest software project ideas.
6. Help plan development tasks.
7. Explain AI, LLMs, RAG and AI agents.
8. Provide beginner-friendly code examples.
9. Explain code step by step.
10. Help with placement preparation.

Response guidelines:

- Use simple English.
- Use headings when useful.
- Use bullet points when useful.
- Explain difficult concepts with examples.
- Give beginner-friendly code.
- Explain code step by step.
- Do not expose API keys.
- Do not expose confidential information.
- Do not invent test results.
- If you do not know something, clearly say so.
"""


# ============================================================
# 7. CHECK GROQ CONFIGURATION
# ============================================================

def check_groq_configuration():

    if not GROQ_API_KEY:

        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured."
        )

    if client is None:

        raise HTTPException(
            status_code=500,
            detail="Groq client is not initialized."
        )


# ============================================================
# 8. GENERATE AI RESPONSE
# ============================================================

def generate_ai_response(
    user_message: str,
    history: List[ChatMessage]
):

    check_groq_configuration()

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    # --------------------------------------------------------
    # Add last 10 messages
    # --------------------------------------------------------

    for item in history[-10:]:

        messages.append(
            {
                "role": item.role,
                "content": item.content
            }
        )

    # --------------------------------------------------------
    # Add current user message
    # --------------------------------------------------------

    messages.append(
        {
            "role": "user",
            "content": user_message.strip()
        }
    )

    try:

        # ----------------------------------------------------
        # Groq API request
        # ----------------------------------------------------

        completion = client.chat.completions.create(

            model="openai/gpt-oss-120b",

            messages=messages,

            temperature=0.4,

            max_tokens=1200
        )

        # ----------------------------------------------------
        # Check response
        # ----------------------------------------------------

        if not completion.choices:

            raise HTTPException(
                status_code=502,
                detail="AI returned no response."
            )

        reply = (
            completion
            .choices[0]
            .message
            .content
        )

        if not reply:

            raise HTTPException(
                status_code=502,
                detail="AI returned an empty response."
            )

        reply = reply.strip()

        if not reply:

            raise HTTPException(
                status_code=502,
                detail="AI returned an empty response."
            )

        return ChatResponse(

            reply=reply,

            model="openai/gpt-oss-120b"
        )

    except HTTPException:

        raise

    except Exception as error:

        print(
            "\n========== GROQ ERROR =========="
        )

        print(
            "Error Type:",
            type(error).__name__
        )

        print(
            "Error:",
            str(error)
        )

        traceback.print_exc()

        print(
            "================================\n"
        )

        raise HTTPException(

            status_code=502,

            detail="Unable to get response from Groq AI."
        )


# ============================================================
# 9. ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {

        "success": True,

        "message": "DevFlow X AI Service is running",

        "status": "online",

        "service": "FastAPI",

        "version": "1.0.0"
    }


# ============================================================
# 10. SIMPLE HEALTH ENDPOINT
# ============================================================

@app.get("/health")
def health():

    return {

        "success": True,

        "status": "healthy",

        "service": "DevFlow X AI Service"
    }


# ============================================================
# 11. FASTAPI CONNECTION TEST
# ============================================================

@app.get("/api/test-fastapi")
def test_fastapi():

    return {

        "success": True,

        "message": "FastAPI is connected successfully",

        "service": "DevFlow X AI Service",

        "status": "online"
    }


# ============================================================
# 12. AI HEALTH CHECK
# ============================================================

@app.get("/api/ai/health")
def ai_health():

    if not GROQ_API_KEY:

        return {

            "success": False,

            "status": "not_configured",

            "message": "GROQ_API_KEY is missing",

            "groq": False
        }

    if client is None:

        return {

            "success": False,

            "status": "not_configured",

            "message": "Groq client is not initialized",

            "groq": False
        }

    return {

        "success": True,

        "status": "healthy",

        "message": "Groq AI service is configured",

        "groq": True
    }


# ============================================================
# 13. CHAT API
# ============================================================

@app.post(
    "/api/ai/chat",
    response_model=ChatResponse
)
def chat_with_ai(
    request: ChatRequest
):

    return generate_ai_response(

        user_message=request.message,

        history=request.history
    )


# ============================================================
# 14. ASK API
# ============================================================

@app.post(
    "/api/ai/ask",
    response_model=ChatResponse
)
def ask_ai(
    request: AskRequest
):

    return generate_ai_response(

        user_message=request.question,

        history=request.history
    )


# ============================================================
# 15. START SERVER
# ============================================================

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

        reload=False
    )

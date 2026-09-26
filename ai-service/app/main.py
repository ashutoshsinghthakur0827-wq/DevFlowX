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
    "http://localhost:5173"
)


# ============================================================
# 2. INITIALIZE GROQ CLIENT
# ============================================================

client = None

if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)


# ============================================================
# 3. FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="DevFlow X AI Service",
    description="AI assistant backend for DevFlow X",
    version="1.0.0",
)


# ============================================================
# 4. CORS
# ============================================================

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

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
    role: Literal["user", "assistant"]
    content: str = Field(
        ...,
        min_length=1,
        max_length=8000,
    )


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
    )

    history: List[ChatMessage] = Field(
        default_factory=list
    )


class AskRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=4000,
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
- AI agents
- RAG
- Software project management

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
- Use headings and bullet points when useful.
- Explain difficult concepts with examples.
- Give beginner-friendly code.
- Do not expose API keys.
- Do not invent test results.
- Do not expose confidential information.
- If you do not know something, clearly say so.
"""


# ============================================================
# 7. GROQ CONFIGURATION
# ============================================================

def check_groq_configuration():

    if not GROQ_API_KEY or client is None:

        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured."
        )


# ============================================================
# 8. GENERATE AI RESPONSE
# ============================================================

def generate_ai_response(
    user_message: str,
    history: List[ChatMessage],
):

    check_groq_configuration()

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        }
    ]

    # Add last 10 messages
    for item in history[-10:]:

        messages.append(
            {
                "role": item.role,
                "content": item.content,
            }
        )

    # Add current message
    messages.append(
        {
            "role": "user",
            "content": user_message.strip(),
        }
    )

    try:

        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.4,
            max_tokens=1200,
        )

        if not completion.choices:

            raise HTTPException(
                status_code=502,
                detail="AI returned no response."
            )

        reply = completion.choices[0].message.content

        if not reply or not reply.strip():

            raise HTTPException(
                status_code=502,
                detail="AI returned an empty response."
            )

        return ChatResponse(
            reply=reply.strip(),
            model="openai/gpt-oss-120b",
        )

    except HTTPException:
        raise

    except Exception as error:

        print("\n========== GROQ ERROR ==========")
        print("Error:", type(error).__name__)
        print("Message:", str(error))
        traceback.print_exc()
        print("================================\n")

        raise HTTPException(
            status_code=502,
            detail="Unable to get response from Groq AI."
        )


# ============================================================
# 9. ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "success": True,
        "message": "DevFlow X AI Service is running",
        "status": "online",
    }


# ============================================================
# 10. HEALTH
# ============================================================

@app.get("/api/ai/health")
def ai_health():

    if not GROQ_API_KEY or client is None:

        return {
            "success": False,
            "status": "not_configured",
            "message": "GROQ_API_KEY is missing",
        }

    return {
        "success": True,
        "status": "healthy",
        "message": "Groq AI service is configured",
    }


# ============================================================
# 11. CHAT
# ============================================================

@app.post(
    "/api/ai/chat",
    response_model=ChatResponse,
)
def chat_with_ai(request: ChatRequest):

    return generate_ai_response(
        user_message=request.message,
        history=request.history,
    )


# ============================================================
# 12. ASK
# ============================================================

@app.post(
    "/api/ai/ask",
    response_model=ChatResponse,
)
def ask_ai(request: AskRequest):

    return generate_ai_response(
        user_message=request.question,
        history=request.history,
    )


# ============================================================
# 13. LOCAL DEVELOPMENT
# ============================================================

if __name__ == "__main__":

    import uvicorn

    port = int(
        os.getenv("PORT", "8000")
    )

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
    )

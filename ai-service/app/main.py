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

# Initialize Groq client
client = None

if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)


# ============================================================
# 2. FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="DevFlow X AI Service",
    description="AI assistant backend for DevFlow X",
    version="1.0.0",
)


# ============================================================
# 3. CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 4. PYDANTIC MODELS
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
# 5. SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are DevFlow X AI Assistant.

DevFlow X is a software engineering management platform
built using technologies such as:

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
3. Explain React, JavaScript, Python, FastAPI, and MongoDB.
4. Help debug coding errors.
5. Suggest software project ideas.
6. Help plan tasks and development roadmaps.
7. Explain AI, LLMs, RAG, and AI agents.
8. Provide beginner-friendly code examples.
9. Explain code step by step when requested.
10. Give practical placement preparation guidance.

Response guidelines:

- Use simple and clear English.
- Use headings and bullet points when helpful.
- Explain difficult concepts with examples.
- Do not invent test results, credentials, or API responses.
- Never expose API keys or confidential information.
- If you do not know something, clearly say so.
- Give safe and legal technical guidance.
"""


# ============================================================
# 6. HELPER FUNCTION: CHECK GROQ CONFIGURATION
# ============================================================


def check_groq_configuration():
    """
    Check whether the Groq API key and client are configured.
    """

    if not GROQ_API_KEY or client is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "Groq API key is not configured. "
                "Check the GROQ_API_KEY environment variable."
            ),
        )


# ============================================================
# 7. HELPER FUNCTION: GENERATE AI RESPONSE
# ============================================================


def generate_ai_response(
    user_message: str,
    history: List[ChatMessage],
):
    """
    Send a message and conversation history to Groq.
    """

    check_groq_configuration()

    # System message
    system_message = {
        "role": "system",
        "content": SYSTEM_PROMPT,
    }

    # Start messages list
    messages = [system_message]

    # Add the last 10 history messages
    for item in history[-10:]:
        messages.append(
            {
                "role": item.role,
                "content": item.content,
            }
        )

    # Add the current user message
    messages.append(
        {
            "role": "user",
            "content": user_message.strip(),
        }
    )

    try:
        # Send request to Groq
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.4,
            max_tokens=1200,
        )

        # Read the response
        if not completion.choices:
            raise HTTPException(
                status_code=502,
                detail="The AI returned no choices.",
            )

        reply = completion.choices[0].message.content

        # Validate response
        if not reply or not reply.strip():
            raise HTTPException(
                status_code=502,
                detail="The AI returned an empty response.",
            )

        return ChatResponse(
            reply=reply.strip(),
            model="openai/gpt-oss-120b",
        )

    except HTTPException:
        raise

    except Exception as error:
        print("\n========== GROQ AI ERROR ==========")
        print("Error type:", type(error).__name__)
        print("Error message:", str(error))
        traceback.print_exc()
        print("========== END GROQ AI ERROR ==========\n")

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to get an AI response. "
                "Check the FastAPI Render logs."
            ),
        )


# ============================================================
# 8. ROOT ROUTE
# ============================================================


@app.get("/")
def root():
    return {
        "success": True,
        "message": "DevFlow X AI Service is running",
        "status": "online",
    }


# ============================================================
# 9. HEALTH CHECK ROUTE
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
# 10. CHAT ROUTE
# ============================================================


@app.post(
    "/api/ai/chat",
    response_model=ChatResponse,
)
def chat_with_ai(request: ChatRequest):
    """
    Chat endpoint using the 'message' field.

    Request example:
    {
        "message": "Explain React",
        "history": []
    }
    """

    return generate_ai_response(
        user_message=request.message,
        history=request.history,
    )


# ============================================================
# 11. ASK ROUTE FOR EXPRESS BACKEND
# ============================================================


@app.post(
    "/api/ai/ask",
    response_model=ChatResponse,
)
def ask_ai(request: AskRequest):
    """
    Ask endpoint using the 'question' field.

    Request example:
    {
        "question": "Explain React",
        "history": []
    }
    """

    return generate_ai_response(
        user_message=request.question,
        history=request.history,
    )


# ============================================================
# 12. LOCAL DEVELOPMENT ENTRY POINT
# ============================================================


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )

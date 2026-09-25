
import os
from typing import List, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq


# Load environment variables from .env
load_dotenv()


# Read Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# Create Groq client only when the API key exists
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


# Create FastAPI application
app = FastAPI(
    title="DevFlow X AI Service",
    description="AI assistant backend for the DevFlow X project",
    version="1.0.0",
)


# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Allowed chat roles
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(
        ...,
        min_length=1,
        max_length=8000
    )


# Request model
class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000
    )
    history: List[ChatMessage] = Field(
        default_factory=list
    )


# Response model
class ChatResponse(BaseModel):
    reply: str
    model: str


# Health check endpoint
@app.get("/")
def root():
    return {
        "message": "DevFlow X AI Service is running",
        "status": "online"
    }


# AI health endpoint
@app.get("/api/ai/health")
def ai_health():
    if not GROQ_API_KEY:
        return {
            "status": "not_configured",
            "message": "GROQ_API_KEY is missing"
        }

    return {
        "status": "healthy",
        "message": "Groq AI service is configured"
    }


# Chat endpoint
@app.post("/api/ai/chat", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest):

    # Check API key
    if not GROQ_API_KEY or client is None:
        raise HTTPException(
            status_code=500,
            detail="Groq API key is not configured. Check your .env file."
        )

    # Create the system instruction
    system_message = {
        "role": "system",
        "content": """
You are DevFlow X AI Assistant.

DevFlow X is an AI-powered software engineering management platform.

Your responsibilities:
1. Help users with software development.
2. Explain React, JavaScript, Node.js, Express, MongoDB and FastAPI.
3. Help with project management and task planning.
4. Explain programming errors in beginner-friendly language.
5. Provide simple examples when useful.
6. Answer clearly using headings and bullet points.
7. Do not claim that you executed code if you did not execute it.
8. If the user asks for code, provide readable and beginner-friendly code.
9. Keep answers practical and useful for college projects and placement preparation.
"""
    }

    # Prepare conversation messages
    messages = [system_message]

    # Add previous chat history
    for item in request.history[-10:]:
        messages.append(
            {
                "role": item.role,
                "content": item.content
            }
        )

    # Add the latest user message
    messages.append(
        {
            "role": "user",
            "content": request.message
        }
    )

    try:
        # Call Groq Chat Completions API
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.4,
            max_tokens=1200
        )

        # Extract AI response
        reply = completion.choices[0].message.content

        if not reply:
            raise HTTPException(
                status_code=502,
                detail="The AI returned an empty response."
            )

        return ChatResponse(
            reply=reply,
            model="openai/gpt-oss-120b"
        )

    except Exception as error:
        import traceback

    print("\n========== AI ERROR ==========")
    print(type(error).__name__)
    print(str(error))
    traceback.print_exc()
    print("========== END AI ERROR ==========\n")

    raise HTTPException(
        status_code=500,
        detail="Unable to get an AI response. Check the backend terminal."
    )
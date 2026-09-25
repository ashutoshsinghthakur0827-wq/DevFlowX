from fastapi import APIRouter, HTTPException

from app.schemas import (
    AIQuestionRequest,
    AIQuestionResponse
)

from app.services.ai_service import generate_ai_answer


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"]
)


@router.get("/health")
def ai_health():
    return {
        "status": "ok",
        "service": "FastAPI AI Service"
    }


@router.post(
    "/ask",
    response_model=AIQuestionResponse
)
def ask_ai(request: AIQuestionRequest):
    try:
        question = request.question.strip()

        if not question:
            raise HTTPException(
                status_code=400,
                detail="Question cannot be empty"
            )

        answer = generate_ai_answer(question)

        return {
            "answer": answer
        }

    except HTTPException:
        raise

    except Exception as error:
        print("AI service error:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response"
        )
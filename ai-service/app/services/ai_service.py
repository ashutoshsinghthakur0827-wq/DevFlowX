def generate_ai_answer(question: str) -> str:
    question_lower = question.lower()

    if "react" in question_lower:
        return (
            "React is a JavaScript library used to build "
            "interactive user interfaces using components."
        )

    if "fastapi" in question_lower:
        return (
            "FastAPI is a Python framework used to build "
            "fast and modern APIs."
        )

    if "mern" in question_lower:
        return (
            "MERN stands for MongoDB, Express, React, and Node.js."
        )

    return (
        f"Your question was: {question}. "
        "This is the DevFlow X local AI response."
    )
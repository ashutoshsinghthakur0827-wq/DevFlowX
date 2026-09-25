
import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name: str = os.getenv(
        "APP_NAME",
        "DevFlow X AI Service"
    )

    app_env: str = os.getenv(
        "APP_ENV",
        "development"
    )

    ai_service_port: int = int(
        os.getenv("AI_SERVICE_PORT", "8000")
    )

    groq_api_key: str = os.getenv(
        "GROQ_API_KEY",
        ""
    )

    groq_model: str = os.getenv(
        "GROQ_MODEL",
        "llama-3.3-70b-versatile"
    )


settings = Settings()
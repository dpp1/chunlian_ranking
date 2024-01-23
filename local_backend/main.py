import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config

from fastapi_routes import router as llm_based_chatbot_router


app = FastAPI(
    title="A beautiful and amazing application API",
    description="An chatbot service",
)
app.include_router(llm_based_chatbot_router)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_CORS_ORIGINS,
    allow_methods=config.ALLOWED_CORS_METHODS,
    allow_headers=config.ALLOWED_CORS_HEADERS
)

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.HOST, port=config.PORT, log_level="info")
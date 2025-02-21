from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.endpoints import router as api_router
from src.api.dependencies import setup_dependencies

def create_app():
    app = FastAPI(title="Interview API", version="1.0.0")

    # Setup middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Setup dependencies (attaches mongo and redis to the app state)
    setup_dependencies(app)
    
    # Include routes
    app.include_router(api_router, prefix="/api/v1")
    
    return app

app = create_app()
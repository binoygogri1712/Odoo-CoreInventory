from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes.auth import router as auth_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TraceFlow API",
    description="Backend API for TraceFlow Inventory Management System",
    version="1.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "TraceFlow API is running", "version": "1.0.0"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import ping_db
from app.routes import cases, documents, users

load_dotenv()

app = FastAPI(
    title="LegalOS Backend API",
    description="AI-powered legal operations backend for insurance companies.",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(users.router)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    db_ok = ping_db()
    return {
        "status": "online",
        "service": "LegalOS Backend",
        "version": "1.0.0",
        "mongodb": "connected" if db_ok else "disconnected",
    }


@app.get("/health", tags=["Health"])
def health():
    db_ok = ping_db()
    return {
        "api": "ok",
        "mongodb": "ok" if db_ok else "error",
    }

from app.services.fireworks_service import fireworks_client, FIREWORKS_MODEL

@app.post("/chat", tags=["AI"])
def chat_endpoint(payload: dict):
    """
    Direct prompt-based chat endpoint for real-time legal inquiries.
    """
    messages_payload = payload.get("messages", [])
    
    formatted_messages = [
        {"role": "system", "content": "You are Nova, the AI assistant built directly into LegalOS, a proprietary AI-powered legal operations platform for insurance companies. Do not confuse yourself with any public startup called LegalOS. Your role is to help insurance legal teams analyze claims, extract documents, monitor risk within this command center, and answer questions concisely and accurately."}
    ]
    
    if not messages_payload:
        prompt = payload.get("message", "Hello")
        formatted_messages.append({"role": "user", "content": prompt})
    else:
        for msg in messages_payload:
            role = "assistant" if msg.get("role") == "ai" else "user"
            formatted_messages.append({"role": role, "content": msg.get("text", "")})

    try:
        response = fireworks_client.chat.completions.create(
            model=FIREWORKS_MODEL,
            messages=formatted_messages,
            max_tokens=800
        )
        return {"response": response.choices[0].message.content.strip()}
    except Exception as e:
        return {"response": f"AI Engine Offline: {str(e)}"}


from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from app.database import users_col

router = APIRouter(prefix="/users", tags=["Users"])


def _id(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/")
def list_users():
    users = list(users_col.find())
    return [_id(u) for u in users]


@router.post("/")
def create_user(payload: dict):
    payload["created_at"] = datetime.utcnow()
    result = users_col.insert_one(payload)
    payload["id"] = str(result.inserted_id)
    payload.pop("_id", None)
    return payload


@router.get("/{user_id}")
def get_user(user_id: str):
    try:
        user = users_col.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return _id(user)

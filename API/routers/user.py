from fastapi import APIRouter, Query, HTTPException
from database import db
from models import UpdateSettings
from jose import jwt


router = APIRouter()
SECRET = "secret"

def get_user(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload["username"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/stats")
async def user_stats(token: str = Query(...)):
    user = get_user(token)
    count = await db.accidents.count_documents({"user": user})
    return {"total_accidents": count}

@router.post("/settings")
async def update_settings(settings: UpdateSettings, token: str = Query(...)):
    user = get_user(token)
    await db.users.update_one({"username": user}, {"$set": {"settings": settings.dict(exclude_none=True)}})
    return {"msg": "Settings updated"}
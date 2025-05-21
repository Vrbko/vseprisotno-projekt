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

    # Count accidents created by the user
    accident_count = await db.accidents.count_documents({"user": user})

    # Count reports submitted by the user
    report_count = await db.reports.count_documents({"user": user})

    # Aggregate upvotes and downvotes from all score documents for this user
    scores_cursor = db.scores.find({"user": user})
    total_upvotes = 0
    total_downvotes = 0

    async for score in scores_cursor:
        total_upvotes += score.get("upvotes", 0)
        total_downvotes += score.get("downvotes", 0)

    return {
        "total_accidents": accident_count,
        "total_reports": report_count,
        "total_upvotes": total_upvotes,
        "total_downvotes": total_downvotes,
    }

@router.post("/settings")
async def update_settings(settings: UpdateSettings, token: str = Query(...)):
    user = get_user(token)
    await db.users.update_one({"username": user}, {"$set": {"settings": settings.dict(exclude_none=True)}})
    return {"msg": "Settings updated"}
from fastapi import APIRouter, Query, HTTPException
from database import db
from jose import jwt
from models import Score, ScoreUpdate
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()
SECRET = "secret"

def get_user(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload["username"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    

@router.get("/")
async def get_all_scores(token: str = Query(...)):
    user = get_user(token)
    cursor = db.scores.find({"user": user})
    scores = []
    async for score in cursor:
        score["_id"] = str(score["_id"])  # convert ObjectId for JSON serialization
        scores.append(score)
    return scores


@router.post("/{accident_id}/upvote")
async def upvote(accident_id: str, token: str = Query(...)):
    user = get_user(token)

    try:
        accident_obj_id = ObjectId(accident_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid accident ID format")

    original_accident = await db.accidents.find_one({"_id": accident_obj_id})
    if not original_accident:
        raise HTTPException(status_code=404, detail="No accident found for this accident")

    accident_owner = original_accident["user"]

    existing = await db.votes.find_one({"accident_id": accident_obj_id, "user": user})
    if existing:
        if existing["vote"] == "up":
            raise HTTPException(status_code=200, detail="Already upvoted")
        else:
            await db.votes.update_one(
                {"accident_id": accident_obj_id, "user": user},
                {"$set": {"vote": "up"}}
            )
            await db.scores.update_one(
                {"accident_id": accident_obj_id, "user": accident_owner},
                {"$inc": {"upvotes": 1, "downvotes": -1}}
            )
            return {"msg": "Changed vote to upvote"}

    await db.votes.insert_one({"accident_id": accident_obj_id, "user": user, "vote": "up"})
    await db.scores.update_one(
        {"accident_id": accident_obj_id, "user": accident_owner},
        {
            "$inc": {"upvotes": 1},
            "$setOnInsert": {"downvotes": 0, "number_of_reports": 0, "user": accident_owner}
        },
        upsert=True
    )
    return {"msg": "Upvoted"}


@router.post("/{accident_id}/downvote")
async def downvote(accident_id: str, token: str = Query(...)):
    user = get_user(token)

    try:
        accident_obj_id = ObjectId(accident_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid accident ID format")



    original_accident = await db.accidents.find_one({"_id": accident_obj_id})
    if not original_accident:
        raise HTTPException(status_code=404, detail="No accident found for this accident")

    accident_owner = original_accident["user"]

    existing = await db.votes.find_one({"accident_id": accident_obj_id, "user": user})
    if existing:
        if existing["vote"] == "down":
            raise HTTPException(status_code=200, detail="Already downvoted")
        else:
            await db.votes.update_one(
                {"accident_id": accident_obj_id, "user": user},
                {"$set": {"vote": "down"}}
            )
            await db.scores.update_one(
                {"accident_id": accident_obj_id, "user": accident_owner},
                {"$inc": {"downvotes": 1, "upvotes": -1}}
            )
            return {"msg": "Changed vote to downvote"}

    await db.votes.insert_one({"accident_id": accident_obj_id, "user": user, "vote": "down"})
    await db.scores.update_one(
        {"accident_id": accident_obj_id, "user": accident_owner},
        {
            "$inc": {"downvotes": 1},
            "$setOnInsert": {"upvotes": 0, "number_of_reports": 0, "user": accident_owner}
        },
        upsert=True
    )
    return {"msg": "Downvoted"}
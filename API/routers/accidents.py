from fastapi import APIRouter, Depends, HTTPException, Query
from models import Accident
from database import db
from typing import List
from jose import jwt
from bson import ObjectId


router = APIRouter()
SECRET = "secret"
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

def get_user(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload["username"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/")
async def create_accident(accident: Accident, token: str = Query(...)):
    user = get_user(token)
    await db.accidents.insert_one({**accident.dict(), "user": user})
    return {"msg": "Accident created"}


# Route to get accidents for a specific user
@router.get("/user", response_model=List[dict])
async def list_user_accidents(token: str = Query(...)):
    user = get_user(token)  # Verify and retrieve the user
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch only the accidents created by the current user
    cursor = db.accidents.find({"user": user})
    accidents = await cursor.to_list(length=100)

    results = []
    for accident in accidents:
        accident_id = accident["_id"]

        # Convert _id for serialization
        accident["_id"] = str(accident_id)

        # Aggregate upvotes, downvotes, and number_of_reports
        scores_cursor = db.scores.find({"accident_id": accident_id})
        scores = await scores_cursor.to_list(length=100)

        upvotes = sum(score.get("upvotes", 0) for score in scores)
        downvotes = sum(score.get("downvotes", 0) for score in scores)
        number_of_reports = sum(score.get("number_of_reports", 0) for score in scores)

        accident["upvotes"] = upvotes
        accident["downvotes"] = downvotes
        accident["number_of_reports"] = number_of_reports

        results.append(accident)

    return results

# Route to get all accidents (only if the user is valid)
@router.get("/", response_model=List[dict])
async def list_all_accidents(token: str = Query(...)):
    user = get_user(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    accidents_cursor = db.accidents.find()
    accidents = await accidents_cursor.to_list(length=100)

    results = []
    for accident in accidents:
        accident_id = accident["_id"]

        # Convert _id for serialization
        accident["_id"] = str(accident_id)

        # Aggregate upvotes, downvotes, and number_of_reports
        scores_cursor = db.scores.find({"accident_id": accident_id})
        scores = await scores_cursor.to_list(length=100)

        upvotes = sum(score.get("upvotes", 0) for score in scores)
        downvotes = sum(score.get("downvotes", 0) for score in scores)
        number_of_reports = sum(score.get("number_of_reports", 0) for score in scores)

        accident["upvotes"] = upvotes
        accident["downvotes"] = downvotes
        accident["number_of_reports"] = number_of_reports

        results.append(accident)

    return results

@router.get("/search")
async def search_accidents(q: str = "", token: str = Query(...)):
    user = get_user(token)
    query = {"user": user, "description": {"$regex": q, "$options": "i"}}
    return await db.accidents.find(query).to_list(100)

@router.delete("/{accident_id}")
async def delete_accident(accident_id: str, token: str = Query(...)):
    user = get_user(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    result = await db.accidents.delete_one({"_id": ObjectId(accident_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"msg": "Deleted"}
from fastapi import APIRouter, Depends, HTTPException, Query
from models import Accident
from database import db
from typing import List
from jose import jwt


router = APIRouter()
SECRET = "secret"

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

@router.get("/", response_model=List[Accident])
async def list_accidents(token: str = Query(...)):
    user = get_user(token)
    cursor = db.accidents.find({"user": user})
    return await cursor.to_list(100)

@router.get("/search")
async def search_accidents(q: str = "", token: str = Query(...)):
    user = get_user(token)
    query = {"user": user, "description": {"$regex": q, "$options": "i"}}
    return await db.accidents.find(query).to_list(100)

@router.delete("/{accident_id}")
async def delete_accident(accident_id: str, token: str = Query(...)):
    from bson import ObjectId
    user = get_user(token)
    result = await db.accidents.delete_one({"_id": ObjectId(accident_id), "user": user})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"msg": "Deleted"}
from fastapi import APIRouter, Query, HTTPException
from database import db
from jose import jwt
from models import Report
from bson import ObjectId


router = APIRouter()
SECRET = "secret"

def get_user(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload["username"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/")
async def create_report(report: Report, token: str = Query(...)):
    reporting_user = get_user(token)

    # Insert the new report with the reporting user info
    await db.reports.insert_one({**report.dict(), "user": reporting_user})

    # Find the accident to get the accident owner user
    accident = await db.accidents.find_one({"_id": ObjectId(report.accident_id)})

    if not accident:
        raise HTTPException(status_code=404, detail="Accident not found")

    accident_owner_user = accident.get("user")

    # Update the score for the accident owner
    await db.scores.update_one(
        {"accident_id": report.accident_id, "user": accident_owner_user},
        {
            "$inc": {"number_of_reports": 1},
            "$setOnInsert": {"upvotes": 0, "downvotes": 0}
        },
        upsert=True,
    )

    return {"msg": "Report created and score updated"}

@router.get("/")
async def get_all_reports(token: str = Query(...)):
    user = get_user(token)
    cursor = db.reports.find({"user": user})
    reports = []
    async for report in cursor:
        report["_id"] = str(report["_id"])  # convert ObjectId to string for JSON
        reports.append(report)
    return reports



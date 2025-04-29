from fastapi import APIRouter, HTTPException
from models import UserRegister, UserLogin
from database import db
from passlib.hash import bcrypt
from jose import jwt


SECRET = "secret"

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed = bcrypt.hash(user.password)
    await db.users.insert_one({"email": user.email, "username": user.username, "password": hashed})
    return {"msg": "User registered"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"username": user.username})
    if not db_user or not bcrypt.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"username": user.username}, SECRET, algorithm="HS256")
    return {"token": token}
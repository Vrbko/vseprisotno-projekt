from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Accident(BaseModel):
    description: str
    datetime: datetime
    category: str
    image_base64: str
    latitude: float
    longitude: float

class UpdateSettings(BaseModel):
    setting_1: Optional[str] = None
    setting_2: Optional[bool] = None

class ImageInput(BaseModel):
    image_base64: str
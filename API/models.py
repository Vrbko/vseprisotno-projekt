from pydantic import BaseModel, EmailStr, Field, root_validator
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
    id: str = Field(alias="_id")
    description: str
    datetime: datetime
    category: str
    image_base64: str
    latitude: float
    longitude: float
    user: str

    @root_validator(pre=True)
    def convert_id(cls, values: dict[str, any]):
        if "_id" in values:
            values["_id"] = str(values["_id"])
        return values

class UpdateSettings(BaseModel):
    setting_1: Optional[str] = None
    setting_2: Optional[bool] = None

class ImageInput(BaseModel):
    image_base64: str


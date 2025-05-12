from fastapi import FastAPI
from routers import auth, accidents, user, clasify
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

app = FastAPI()



app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(accidents.router, prefix="/accidents", tags=["Accidents"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(clasify.router, prefix="/clasify", tags=["Clasify"])
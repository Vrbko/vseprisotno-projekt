from fastapi import FastAPI
from routers import auth, accidents, user

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(accidents.router, prefix="/accidents", tags=["Accidents"])
app.include_router(user.router, prefix="/user", tags=["User"])
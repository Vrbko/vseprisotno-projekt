import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()  # Load environment variables from .env

# Fetch the MONGO_URI from .env
MONGO_URI = os.getenv("MONGO_URI")

# Ensure the URI is correct
if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in the environment variables.")

# Connect to MongoDB using Motor (AsyncIO Mongo Client)
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database()  # Connect to the default database specified in the URI

# Perform database operations
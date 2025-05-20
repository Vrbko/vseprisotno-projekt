from fastapi import APIRouter, HTTPException
from models import ImageInput
from passlib.hash import bcrypt
from jose import jwt
from PIL import Image
import torch
import base64
from transformers import CLIPProcessor, CLIPModel
from io import BytesIO
from fastapi import Query, Body

SECRET = "secret"

router = APIRouter()

def get_user(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload["username"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
# Load CLIP model and processor once at startup
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")
labels = [
    "car accident", "earthquake", "fire", "flood", "traffic jam", "hurricane",
    "road construction", "truck accident", "wildfire", "landslide", "tornado", 
    "plane crash", "train derailment", "road block", "pothole repair", "construction zone",
    "traffic cones", "snowstorm", "rainstorm", "lightning strike", "gas leak", "bicycle crash",
    "public transportation", "sidewalk", "intersection with traffic lights", "stop sign",
    "construction site", "building demolition", "city street", "sunny day", "cloudy weather",
    "pedestrian crossing", "motorcycle accident", "rainbow", "streetlight", "heavy machinery on road",
    "roadway maintenance", "crosswalk", "emergency vehicle", "snow-covered road", "overcast sky"
]

@router.post("/")
async def classify_image(token: str = Query(...), data: ImageInput = Body(...)):
    user = get_user(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        # Decode base64 image
        image_data = base64.b64decode(data.image_base64)
        image = Image.open(BytesIO(image_data)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    # Preprocess input
    inputs = processor(text=labels, images=image, return_tensors="pt", padding=True)

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits_per_image
    probs = logits.softmax(dim=-1)
    top_idx = torch.argmax(probs, dim=-1).item()
    predicted_label = labels[top_idx]
    confidence = probs[0, top_idx].item()

    return {
        "predicted_label": predicted_label,
        "confidence": confidence
    }
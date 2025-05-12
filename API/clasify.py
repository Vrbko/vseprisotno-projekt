from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import os
# Load the pre-trained CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")



# Define the possible labels for classification
#labels = ["car accident", "earthquake", "fire", "flood", "traffic jam", "hurricane"]

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


# Path to the folder containing images
image_folder = "images"

# Loop through all .jpg images in the folder
for filename in os.listdir(image_folder):
    if filename.lower().endswith(".jpg"):
        image_path = os.path.join(image_folder, filename)
        try:
            image = Image.open(image_path).convert("RGB")
        except Exception as e:
            print(f"Error opening {filename}: {e}")
            continue

        # Process the image and labels
        inputs = processor(text=labels, images=image, return_tensors="pt", padding=True)

        with torch.no_grad():
            outputs = model(**inputs)

        # Get prediction
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=-1)
        predicted_label_idx = torch.argmax(probs, dim=-1).item()
        predicted_label = labels[predicted_label_idx]

        print(f"{filename}: {predicted_label}")
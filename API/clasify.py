from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

# Load the pre-trained CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")

# Load and preprocess the image
image = Image.open("image.jpg")

# Define the possible labels for classification
labels = ["car accident", "earthquake", "fire", "flood", "traffic jam", "hurricane"]

# Process the image and the text labels
inputs = processor(text=labels, images=image, return_tensors="pt", padding=True)

with torch.no_grad():
    output = model(**inputs)

# The output contains both image and text logits
logits_per_image = output.logits_per_image
logits_per_text = output.logits_per_text


# Get the predicted label
probs = logits_per_image.softmax(dim=-1)  # Softmax to get probability
predicted_label_idx = torch.argmax(probs, dim=-1).item()
predicted_label = labels[predicted_label_idx]

print(f"Predicted label: {predicted_label}")
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages inline
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    python-jose \
    passlib[bcrypt] \
    pillow \
    torch \
    transformers \
    pydantic[email] \
    motor

# Copy app code
COPY . .

# Expose the app port
EXPOSE 8080

# Run the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
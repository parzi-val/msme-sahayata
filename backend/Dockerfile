# Base image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install dependencies (for building some wheels if needed)
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy necessary files and folders (excluding msme-docs)
COPY main.py .
COPY msme-rag.py .
COPY .env .
COPY core ./core
COPY msme_db ./msme_db

# Expose default port used by Cloud Run
EXPOSE 8080

# Run the FastAPI app (adjust path if your app instance is named differently)
CMD ["python", "main.py"]


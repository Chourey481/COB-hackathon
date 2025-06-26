from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import numpy as np
from PIL import Image
import io
import pickle

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load the model (placeholder for now)
model = None
try:
    with open('model/gesture_model.pkl', 'rb') as f:
        model = pickle.load(f)
except:
    print("Model file not found. Please ensure gesture_model.pkl is in the model directory.")

@app.get("/")
def read_root():
    return {"message": "Welcome to Sign2Speak API"}

@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Preprocess image (placeholder for actual preprocessing)
        # This should match your model's expected input format
        image = image.resize((64, 64))  # Adjust size as needed
        image_array = np.array(image)
        
        # Make prediction (placeholder logic)
        if model is not None:
            prediction = model.predict(np.expand_dims(image_array, axis=0))
            predicted_letter = chr(65 + np.argmax(prediction))  # Assuming A=0, B=1, etc.
        else:
            predicted_letter = 'A'  # Default response if model isn't loaded
            
        return {"predicted_letter": predicted_letter}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from keras.preprocessing import image
from PIL import Image
import numpy as np
import io

# Run with uvicorn main:app --reload

# Create backend instance + allow access from frontend
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = load_model("digitclassifier.keras")

# POST endpoint to predict the number (from this link -> https://huggingface.co/lizardwine/DigitClassifier)
@app.post("/predict")
async def predict(file: UploadFile = File(...)): # https://stackoverflow.com/questions/63048825/how-to-upload-file-using-fastapi -> tell fastapi that it is a file upload
    # Get the image from parameters as grayscale
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("L").resize((28, 28))

    # Process image array
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Feed it to model
    prediction = model.predict(img_array)
    predicted_class = int(np.argmax(prediction))

    return {"prediction": predicted_class}
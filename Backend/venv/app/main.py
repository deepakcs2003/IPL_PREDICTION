from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.predict import predict_outcome
from app.model import MatchData

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to IPL Prediction API"}

@app.post("/predict")
def predict_match(data: MatchData):
    return predict_outcome(data)

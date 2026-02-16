# main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from signal_engine import analyze_stock

app = FastAPI(title="UK ISA Signal Engine")

# Allow your frontend to fetch data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with your frontend URL for security
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "UK ISA Signal Engine is running"}

@app.get("/analyze")
def analyze(ticker: str = Query(...), capital: float = Query(...)):
    """Analyze stock and return trading signal"""
    result = analyze_stock(ticker.upper(), capital)
    return result

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from signal_engine import analyze_stock

app = FastAPI()

# Enable CORS so static dashboard can call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "UK ISA Signal Engine is running"}

@app.get("/analyze")
def analyze(
    ticker: str = Query(..., description="Stock ticker e.g. BP.L"),
    capital: float = Query(..., description="Capital amount")
):
    try:
        result = analyze_stock(ticker, capital)
        return result
    except Exception as e:
        return {
            "error": "Internal Server Error",
            "details": str(e)
        }

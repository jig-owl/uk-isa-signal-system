from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from signal_engine import analyze_stock

app = FastAPI(title="UK ISA Signal Engine")

# Allow your frontend to fetch data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "UK ISA Signal Engine is running"}

@app.get("/analyze")
async def analyze(
    ticker: str = Query(..., description="Stock ticker symbol, e.g., BP.L, ORCL, CRM"),
    capital: float = Query(..., description="Capital in £ or $")
):
    try:
        result = analyze_stock(ticker.upper(), capital)
        return result
    except Exception as e:
        return {"error": "Internal Server Error", "details": str(e)}

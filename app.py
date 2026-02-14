import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np

st.set_page_config(page_title="UK ISA Signal Dashboard", layout="wide")

def compute_rsi(series, window=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def analyze_stock(ticker, capital):
    try:
        data = yf.download(ticker, period="2y", interval="1d", progress=False)
    except:
        return None, "Failed to download data"

    if data.empty:
        return None, "Invalid ticker or no data"

    data["MA50"] = data["Close"].rolling(50).mean()
    data["MA200"] = data["Close"].rolling(200).mean()
    data["RSI"] = compute_rsi(data["Close"])

    latest = data.iloc[-1]

    trend = "Bullish" if latest["Close"] > latest["MA200"] else "Bearish"

    buy_condition = (
        latest["Close"] > latest["MA200"] and
        latest["MA50"] > latest["MA200"] and
        latest["RSI"] < 45
    )

    sell_condition = (
        latest["Close"] < latest["MA50"] or
        latest["RSI"] > 75
    )

    risk = capital * 0.05
    stop_distance = 0.08
    position_size = risk / stop_distance
    stop_price = latest["Close"] * (1 - stop_distance)

    if buy_condition:
        signal = "BUY"
        reason = "Uptrend + RSI pullback"
    elif sell_condition:
        signal = "SELL"
        reason = "Momentum weakening or overbought"
    else:
        signal = "HOLD"
        reason = "No strong setup"

    return {
        "signal": signal,
        "reason": reason,
        "price": round(float(latest["Close"]), 2),
        "trend": trend,
        "rsi": round(float(latest["RSI"]), 2),
        "position_size": round(position_size, 2),
        "stop_price": round(float(stop_price), 2)
    }, None


st.title("UK ISA Trading Signal Dashboard")

ticker = st.text_input("Enter LSE Ticker (e.g. BP.L, HSBA.L)", "BP.L")
capital = st.number_input("Capital (£)", value=500)

if st.button("Analyze"):
    result, error = analyze_stock(ticker, capital)

    if error:
        st.error(error)
    else:
        st.subheader("Signal")
        st.markdown(f"## {result['signal']}")
        st.write(result["reason"])

        st.subheader("Market Data")
        st.write("Price:", result["price"])
        st.write("Trend:", result["trend"])
        st.write("RSI:", result["rsi"])

        st.subheader("Risk Management")
        st.write("Position Size (£):", result["position_size"])
        st.write("Stop Price:", result["stop_price"])

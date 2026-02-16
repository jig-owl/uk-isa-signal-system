document.getElementById("analyze-btn").addEventListener("click", async () => {
    const ticker = document.getElementById("ticker").value.trim();
    const capital = document.getElementById("capital").value;

    if (!ticker || !capital) {
        alert("Please enter both ticker and capital");
        return;
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Loading...";

    try {
        const response = await fetch(`https://uk-isa-signal-system.onrender.com/analyze?ticker=${ticker}&capital=${capital}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<span style="color:red">${data.error}</span>`;
        } else {
            // Determine currency
            let currency = "£";
            if (!ticker.endsWith(".L")) { 
                currency = "$";
            }

            // Trend styling
            const trendClass = data.trend.toLowerCase() === "bullish" ? "bullish" : "bearish";

            // RSI styling
            let rsiClass = "";
            if (data.rsi < 30) rsiClass = "rsi-low";
            else if (data.rsi > 70) rsiClass = "rsi-high";

            // Risk per trade styling
            let riskClass = "";
            if (data.risk_per_trade >= 50) riskClass = "risk-high";
            else if (data.risk_per_trade >= 25) riskClass = "risk-medium";
            else riskClass = "risk-low";

            resultDiv.innerHTML = `
                <strong>Ticker:</strong> ${data.ticker}<br>
                <strong>Signal:</strong> ${data.signal}<br>
                <strong>Reason:</strong> ${data.reason}<br>
                <strong>Price:</strong> ${currency}${data.price}<br>
                <strong>Trend:</strong> <span class="${trendClass}">${d

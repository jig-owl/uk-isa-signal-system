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
            // Determine currency based on ticker (simple heuristic)
            let currency = "£"; // default GBP
            if (ticker.includes(".L") === false) { // anything not ending with .L = likely USD
                currency = "$";
            }

            const trendClass = data.trend.toLowerCase() === "bullish" ? "bullish" : "bearish";
            const rsiClass = data.rsi < 30 ? "rsi-low" : data.rsi > 70 ? "rsi-high" : "";

            resultDiv.innerHTML = `
                <strong>Ticker:</strong> ${data.ticker}<br>
                <strong>Signal:</strong> ${data.signal}<br>
                <strong>Reason:</strong> ${data.reason}<br>
                <strong>Price:</strong> ${currency}${data.price}<br>
                <strong>Trend:</strong> <span class="${trendClass}">${data.trend}</span><br>
                <strong>RSI:</strong> <span class="${rsiClass}">${data.rsi}</span><br>
                <strong>Position Size:</strong> ${currency}${data.position_size}<br>
                <strong>Risk per Trade:</strong> ${currency}${data.risk_per_trade}<br>
                <strong>Stop Price:</strong> ${currency}${data.stop_price}<br>
            `;
        }
    } catch (err) {
        resultDiv.innerHTML = `<span style="color:red">Error fetching data</span>`;
        console.error(err);
    }
});

const analyzeButton = document.getElementById("analyze-btn");
const tickerInput = document.getElementById("ticker");
const capitalInput = document.getElementById("capital");
const resultDiv = document.getElementById("result");

analyzeButton.addEventListener("click", async () => {
    const ticker = tickerInput.value.trim();
    const capital = capitalInput.value;

    if (!ticker || !capital) {
        resultDiv.innerHTML = "<p style='color:red'>Please enter both ticker and capital.</p>";
        return;
    }

    const url = `https://uk-isa-signal-system.onrender.com/analyze?ticker=${ticker}&capital=${capital}`;

    resultDiv.innerHTML = "Loading...";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();

        resultDiv.innerHTML = `
            <p><strong>Ticker:</strong> ${data.ticker}</p>
            <p><strong>Signal:</strong> ${data.signal}</p>
            <p><strong>Reason:</strong> ${data.reason}</p>
            <p><strong>Price:</strong> £${data.price}</p>
            <p><strong>Trend:</strong> ${data.trend}</p>
            <p><strong>RSI:</strong> ${data.rsi.toFixed(2)}</p>
            <p><strong>Risk per trade (£):</strong> £${data.risk_per_trade}</p>
            <p><strong>Position size (£):</strong> £${data.position_size}</p>
            <p><strong>Stop price:</strong> £${data.stop_price}</p>
        `;
    } catch (err) {
        resultDiv.innerHTML = `<p style='color:red'>Error: ${err.message}</p>`;
    }
});

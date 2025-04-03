import { swapTokens } from "./wallet.js";

document.getElementById("swapButton").addEventListener("click", async () => {
    const amount = document.getElementById("swapAmount").value;
    const fromToken = document.getElementById("fromToken").value;
    const toToken = document.getElementById("toToken").value;

    if (!amount || !fromToken || !toToken) {
        alert("Please fill in all fields.");
        return;
    }

    await swapTokens(amount, fromToken, toToken);
});

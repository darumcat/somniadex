import { connectWallet, swapTokens } from "./wallet.js";

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("swapButton").addEventListener("click", () => {
    const amount = document.getElementById("amount").value;
    const fromToken = document.getElementById("fromToken").value;
    const toToken = document.getElementById("toToken").value;

    if (amount && fromToken !== toToken) {
        swapTokens(amount, fromToken, toToken);
    } else {
        alert("Please enter a valid amount and select different tokens.");
    }
});

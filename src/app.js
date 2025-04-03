import { connectWallet, swapTokens, mintToken } from "./wallet.js";
import { updateStatus } from "./ui.js";

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
    // Подключение кошелька
    document.getElementById("connectWallet").addEventListener("click", async () => {
        await connectWallet();
    });

    // Swap токенов
    document.getElementById("swapBtn").addEventListener("click", async () => {
        const fromToken = document.getElementById("fromToken").value;
        const toToken = document.getElementById("toToken").value;
        const amount = document.getElementById("fromAmount").value;
        
        if (!amount || isNaN(amount) {
            updateStatus("Please enter valid amount", true);
            return;
        }
        
        await swapTokens(fromToken, toToken, amount);
    });

    // Mint FDRMCT
    document.getElementById("mintFDRMCT").addEventListener("click", async () => {
        await mintToken("FDRMCT");
    });

    // Mint CRPTHZ
    document.getElementById("mintCRPTHZ").addEventListener("click", async () => {
        await mintToken("CRPTHZ");
    });
});

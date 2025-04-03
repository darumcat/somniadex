import { ethers } from "ethers";
import { PROVIDER_URL, DEX_ABI } from "./config.js";
import { updateUI, showLoading, hideLoading } from "./ui.js";

const DEX_ADDRESS = "0x3344f77ce1d16a8e223fbb53bf4d1d01384eb8f4";
const TOKEN_ADDRESSES = {
    FDRMCT: "0x5a631147bE09F4af9f4f1E817e304D12bDD6Eb22",
    CRPTHZ: "0x9757112F515f6c3c8dCe912b595667780F67B3E8"
};

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
let signer;

async function connectWallet() {
    if (window.ethereum) {
        try {
            // Запрашиваем доступ к аккаунтам
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            
            if (accounts.length === 0) {
                alert("No accounts found. Please make sure MetaMask is connected.");
                return;
            }

            signer = provider.getSigner();
            const address = await signer.getAddress();

            // Проверяем, что адрес корректный
            if (address === accounts[0]) {
                updateUI("walletAddress", address);
                console.log("Connected to wallet:", address);
            } else {
                alert("Failed to connect to the selected account.");
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function swapTokens(amount, fromToken, toToken) {
    if (!signer) {
        alert("Please connect your wallet first.");
        return;
    }
    showLoading();
    try {
        const contract = new ethers.Contract(DEX_ADDRESS, DEX_ABI, signer);
        const tx = await contract.swap(
            TOKEN_ADDRESSES[fromToken],
            TOKEN_ADDRESSES[toToken],
            ethers.utils.parseUnits(amount, 18)
        );
        await tx.wait();
        console.log("Swap successful");
    } catch (error) {
        console.error("Swap failed:", error);
    }
    hideLoading();
}

export { connectWallet, swapTokens, DEX_ADDRESS, TOKEN_ADDRESSES };

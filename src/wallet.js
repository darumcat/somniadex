import { ethers } from "ethers";
import { PROVIDER_URL, DEX_ABI } from "./config.js";
import { updateUI, showLoading, hideLoading } from "./ui.js";

const DEX_ADDRESS = "0x7faD8f4cA2D2315abeDd6D6a2812C60De68dA15E";
const TOKEN_ADDRESSES = {
    FDRMCT: "0x5a631147bE09F4af9f4f1E817e304D12bDD6Eb22",
    CRPTHZ: "0x9757112F515f6c3c8dCe912b595667780F67B3E8"
};

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
let signer;

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            signer = provider.getSigner();
            const address = await signer.getAddress();
            updateUI("walletAddress", address);
            console.log("Connected to wallet:", address);
            checkNetwork();
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function checkNetwork() {
    const network = await provider.getNetwork();
    if (network.chainId !== 1117) { // ID Somnia testnet
        alert("Please connect to Somnia testnet.");
    } else {
        updateUI("networkStatus", "Connected to Somnia testnet");
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

export { connectWallet, swapTokens, DEX_ADDRESS, TOKEN_ADDRESSES, checkNetwork };

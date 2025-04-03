import { ethers } from "ethers";
import { DEX_ABI, PROVIDER_URL } from "./config.js";
import { updateUI, showLoading, hideLoading } from "./ui.js";

const DEX_ADDRESS = "0x7faD8f4cA2D2315abeDd6D6a2812C60De68dA15E";
const TOKEN_ADDRESSES = {
    FDRMCT: "0x5a631147bE09F4af9f4f1E817e304D12bDD6Eb22",
    CRPTHZ: "0x9757112F515f6c3c8dCe912b595667780F67B3E8"
};

let signer;

export async function initSwap() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }
}

export async function swapTokens(amount, fromToken, toToken) {
    if (!signer) {
        alert("Connect wallet first!");
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
        console.log("Swap successful!");
    } catch (error) {
        console.error("Swap failed:", error);
    }
    hideLoading();
}

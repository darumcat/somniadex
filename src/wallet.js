import { ethers } from "ethers";
import { PROVIDER_URL } from "./config.js";
import { updateUI } from "./ui.js";

let provider;
let signer;

export async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }
    
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        
        updateUI("walletAddress", address.slice(0, 6) + "..." + address.slice(-4));
        console.log("Connected to wallet:", address);
    } catch (error) {
        console.error("Wallet connection failed:", error);
    }
}

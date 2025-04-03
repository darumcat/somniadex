import { ethers } from "ethers";
import { CONTRACTS, DEX_ABI, TOKEN_ABI } from "./config.js";
import { updateStatus, showLoading, hideLoading } from "./ui.js";

let provider;
let signer;

export async function connectWallet() {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask not installed");
        }

        // Запрос подключения аккаунта
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        const address = await signer.getAddress();
        document.getElementById("walletAddress").textContent = 
            `${address.slice(0, 6)}...${address.slice(-4)}`;
            
        updateStatus("Wallet connected successfully");
        return true;
    } catch (error) {
        console.error("Wallet connection failed:", error);
        updateStatus(`Connection failed: ${error.message}`, true);
        return false;
    }
}

export async function swapTokens(fromToken, toToken, amount) {
    if (!signer) {
        updateStatus("Please connect wallet first", true);
        return;
    }

    showLoading();
    try {
        const dex = new ethers.Contract(CONTRACTS.DEX, DEX_ABI, signer);
        const tx = await dex.swap(
            CONTRACTS[fromToken],
            CONTRACTS[toToken],
            ethers.utils.parseEther(amount.toString())
        );
        await tx.wait();
        updateStatus(`Swap successful! TX: ${tx.hash}`);
    } catch (error) {
        console.error("Swap failed:", error);
        updateStatus(`Swap failed: ${error.message}`, true);
    } finally {
        hideLoading();
    }
}

export async function mintToken(tokenName) {
    if (!signer) {
        updateStatus("Please connect wallet first", true);
        return;
    }

    showLoading();
    try {
        const token = new ethers.Contract(CONTRACTS[tokenName], TOKEN_ABI, signer);
        const tx = await token.mint(await signer.getAddress());
        await tx.wait();
        updateStatus(`Minted 1000 ${tokenName}! TX: ${tx.hash}`);
    } catch (error) {
        console.error("Mint failed:", error);
        updateStatus(`Mint failed: ${error.message}`, true);
    } finally {
        hideLoading();
    }
}

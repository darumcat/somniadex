import { ethers } from "ethers";
import { PROVIDER_URL, DEX_ABI, FDRMCT_ABI, CRPTHZ_ABI } from "./config.js";
import { updateUI, showLoading, hideLoading } from "./ui.js";

const DEX_ADDRESS = "0x3344f77ce1d16a8e223fbb53bf4d1d01384eb8f4";
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
            fromToken,
            toToken,
            ethers.utils.parseUnits(amount, 18)
        );
        await tx.wait();
        console.log("Swap successful");
    } catch (error) {
        console.error("Swap failed:", error);
    }
    hideLoading();
}

async function mintToken(amount, tokenType) {
    if (!signer) {
        alert("Please connect your wallet first.");
        return;
    }
    showLoading();

    let tokenAddress;
    let tokenABI;
    
    if (tokenType === 'FDRMCT') {
        tokenAddress = "0x5a631147bE09F4af9f4f1E817e304D12bDD6Eb22";
        tokenABI = FDRMCT_ABI;
    } else if (tokenType === 'CRPTHZ') {
        tokenAddress = "0x9757112F515f6c3c8dCe912b595667780F67B3E8";
        tokenABI = CRPTHZ_ABI;
    }

    try {
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const tx = await tokenContract.mint(signer.getAddress(), ethers.utils.parseUnits(amount, 18));
        await tx.wait();
        console.log(`${tokenType} Mint successful`);
    } catch (error) {
        console.error(`${tokenType} Mint failed:`, error);
    } finally {
        hideLoading();
    }
}

export { connectWallet, swapTokens, mintToken };

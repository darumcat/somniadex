import { ethers } from 'ethers';
import { CONFIG } from './config.js';

export class Wallet {
    static async connect() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                
                return {
                    address: accounts[0],
                    provider,
                    signer,
                    contracts: {
                        CRPTHZ: new ethers.Contract(
                            CONFIG.TOKENS.CRPTHZ.address,
                            CONFIG.TOKENS.CRPTHZ.abi,
                            signer
                        ),
                        FDRMCT: new ethers.Contract(
                            CONFIG.TOKENS.FDRMCT.address,
                            CONFIG.TOKENS.FDRMCT.abi,
                            signer
                        ),
                        DEX: new ethers.Contract(
                            CONFIG.DEX.address,
                            CONFIG.DEX.abi,
                            signer
                        )
                    }
                };
            } catch (error) {
                console.error("Error connecting wallet:", error);
                throw error;
            }
        } else {
            throw new Error("Please install MetaMask!");
        }
    }

    static async disconnect() {
        // Add any cleanup logic if needed
        return true;
    }
}

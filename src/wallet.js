import { ethers } from 'ethers';
import { CONFIG } from './config.js';

export class Wallet {
    static async getTokenBalance(tokenName, address) {
        try {
            if (!window.ethereum) throw new Error("Ethereum provider not found");
            if (!CONFIG.TOKENS[tokenName]) throw new Error(`Token ${tokenName} not configured`);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(
                CONFIG.TOKENS[tokenName].address,
                CONFIG.TOKENS[tokenName].abi,
                provider
            );
            return await contract.balanceOf(address);
        } catch (error) {
            console.error(`Error getting ${tokenName} balance:`, error);
            throw error;
        }
    }

    static async connect() {
        if (!window.ethereum) {
            throw new Error("Please install MetaMask!");
        }

        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (!accounts || accounts.length === 0) {
                throw new Error("No accounts found");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const network = await provider.getNetwork();
            if (network.chainId !== CONFIG.NETWORK.chainId) {
                throw new Error(`Please switch to ${CONFIG.NETWORK.name} network`);
            }

            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('lastConnectedWallet', accounts[0]);
            
            const contracts = {
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
            };
            
            const handleAccountsChanged = (newAccounts) => {
                if (!newAccounts || newAccounts.length === 0) {
                    this.disconnect();
                } else {
                    window.location.reload();
                }
            };
            
            const handleChainChanged = () => {
                window.location.reload();
            };
            
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
            
            return {
                address: accounts[0],
                provider,
                signer,
                contracts,
                listeners: {
                    accountsChanged: handleAccountsChanged,
                    chainChanged: handleChainChanged
                }
            };
            
        } catch (error) {
            await this.disconnect();
            throw error;
        }
    }

    static async disconnect() {
        try {
            if (window.ethereum) {
                window.ethereum.removeAllListeners();
                
                try {
                    if (typeof window.ethereum.disconnect === 'function') {
                        await window.ethereum.disconnect();
                    }
                    
                    if (typeof window.ethereum.close === 'function') {
                        await window.ethereum.close();
                    }
                } catch (innerError) {
                    console.warn("Error disconnecting provider:", innerError);
                }
            }
            
            ['walletConnected', 'lastConnectedWallet'].forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            
            window.dispatchEvent(new CustomEvent('walletDisconnected'));
            
            return true;
        } catch (error) {
            console.error("Disconnection failed:", error);
            return false;
        }
    }

    static async autoConnect() {
        try {
            if (localStorage.getItem('walletConnected') === 'true' && window.ethereum) {
                const lastAddress = localStorage.getItem('lastConnectedWallet');
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                
                if (accounts && accounts.length > 0 && 
                    accounts[0].toLowerCase() === lastAddress?.toLowerCase()) {
                    return this.connect();
                }
            }
            return null;
        } catch (error) {
            await this.disconnect();
            return null;
        }
    }
}

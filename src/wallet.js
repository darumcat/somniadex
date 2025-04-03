import { ethers } from 'ethers';
import { CONFIG } from './config.js';

export class Wallet {
    static async connect() {
        if (window.ethereum) {
            try {
                // Запрашиваем аккаунты
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                
                // Сохраняем в localStorage факт подключения
                localStorage.setItem('walletConnected', 'true');
                localStorage.setItem('lastConnectedWallet', accounts[0]);
                
                // Инициализируем контракты
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
                
                // Добавляем листенеры для изменений аккаунтов
                window.ethereum.on('accountsChanged', (newAccounts) => {
                    if (newAccounts.length === 0) {
                        this.disconnect();
                    } else {
                        window.location.reload();
                    }
                });
                
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });
                
                return {
                    address: accounts[0],
                    provider,
                    signer,
                    contracts
                };
                
            } catch (error) {
                await this.disconnect();
                throw error;
            }
        } else {
            throw new Error("Please install MetaMask!");
        }
    }

    static async disconnect() {
        try {
            // 1. Очистка MetaMask
            if (window.ethereum) {
                window.ethereum.removeAllListeners();
                
                if (window.ethereum.selectedAddress) {
                    window.ethereum.selectedAddress = null;
                }
                
                if (window.ethereum.disconnect) {
                    await window.ethereum.disconnect();
                }
            }
            
            // 2. Очистка хранилищ
            ['walletConnected', 'lastConnectedWallet'].forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            
            // 3. Отправка события
            window.dispatchEvent(new Event('walletDisconnected'));
            
            return true;
            
        } catch (error) {
            console.error("Disconnection failed:", error);
            return false;
        }
    }

    static async autoConnect() {
        if (localStorage.getItem('walletConnected') === 'true' && window.ethereum) {
            try {
                const lastAddress = localStorage.getItem('lastConnectedWallet');
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                
                if (accounts.length > 0 && accounts[0].toLowerCase() === lastAddress?.toLowerCase()) {
                    return this.connect();
                }
            } catch (error) {
                await this.disconnect();
            }
        }
        return null;
    }
}

import { ethers } from 'ethers'; // Убедимся, что импорт есть
import { Wallet } from './wallet.js';
import { UI } from './ui.js';
import { CONFIG } from './config.js';

class App {
    constructor() {
        this.wallet = null;
        this.initEventListeners();
        this.checkWalletConnection();
    }

    async initEventListeners() {
        // Wallet connection
        document.getElementById('connect-wallet').addEventListener('click', async () => {
            if (!this.wallet) {
                await this.connectWallet();
            } else {
                await this.disconnectWallet();
            }
        });

        // Mint buttons
        document.getElementById('mint-fdrmct').addEventListener('click', async () => {
            await this.mintToken('FDRMCT');
        });

        document.getElementById('mint-crpthz').addEventListener('click', async () => {
            await this.mintToken('CRPTHZ');
        });

        // Swap button
        document.getElementById('swap-btn').addEventListener('click', async () => {
            await this.executeSwap();
        });

        // Amount input
        document.getElementById('swap-amount').addEventListener('input', async () => {
            await this.updateQuote();
        });

        // Token selection
        document.getElementById('from-token').addEventListener('change', async () => {
            await this.updateQuote();
        });

        document.getElementById('to-token').addEventListener('change', async () => {
            await this.updateQuote();
        });
    }

    async checkWalletConnection() {
        if (window.ethereum && window.ethereum.selectedAddress) {
            try {
                this.wallet = await Wallet.connect();
                UI.updateWalletInfo(this.wallet.address);
                UI.enableButtons();
            } catch (error) {
                console.error("Auto-connect failed:", error);
            }
        }
    }

    async connectWallet() {
        try {
            this.wallet = await Wallet.connect();
            UI.updateWalletInfo(this.wallet.address);
            UI.enableButtons();
        } catch (error) {
            UI.showError(error.message);
        }
    }

    async disconnectWallet() {
        try {
            await Wallet.disconnect();
            this.wallet = null;
            UI.resetWalletInfo();
            UI.disableButtons();
        } catch (error) {
            UI.showError(error.message);
        }
    }

    async mintToken(tokenName) {
        try {
            const buttonId = `mint-${tokenName.toLowerCase()}`;
            const button = document.getElementById(buttonId);
            
            button.disabled = true;
            button.textContent = 'Minting...';
            
            const tx = await this.wallet.contracts[tokenName].mint(ethers.utils.parseUnits("1000", 18));
            await tx.wait();
            
            UI.showSuccess(`Successfully minted 1000 ${tokenName}`);
        } catch (error) {
            UI.showError(`Minting failed: ${error.message}`);
        } finally {
            const button = document.getElementById(`mint-${tokenName.toLowerCase()}`);
            button.disabled = false;
            button.textContent = `Mint ${tokenName}`;
        }
    }

    async updateQuote() {
        if (!this.wallet) return;
        
        const fromToken = document.getElementById('from-token').value;
        const toToken = document.getElementById('to-token').value;
        const amount = document.getElementById('swap-amount').value;
        
        if (!amount || parseFloat(amount) <= 0) {
            document.getElementById('expected-amount').textContent = '0.0';
            return;
        }
        
        try {
            const amountIn = ethers.utils.parseUnits(amount, 18);
            const amountOut = await this.wallet.contracts.DEX.getQuote(
                CONFIG.TOKENS[fromToken].address,
                CONFIG.TOKENS[toToken].address,
                amountIn
            );
            
            const formattedAmount = ethers.utils.formatUnits(amountOut, 18);
            document.getElementById('expected-amount').textContent = parseFloat(formattedAmount).toFixed(4);
        } catch (error) {
            console.error("Quote error:", error);
            document.getElementById('expected-amount').textContent = 'Error';
        }
    }

    async executeSwap() {
        if (!this.wallet) return;
        
        const fromToken = document.getElementById('from-token').value;
        const toToken = document.getElementById('to-token').value;
        const amount = document.getElementById('swap-amount').value;
        
        if (!amount || parseFloat(amount) <= 0) {
            UI.showError("Please enter a valid amount");
            return;
        }
        
        try {
            const swapBtn = document.getElementById('swap-btn');
            swapBtn.disabled = true;
            swapBtn.textContent = 'Swapping...';
            
            // Approve token spending
            const amountIn = ethers.utils.parseUnits(amount, 18);
            const approveTx = await this.wallet.contracts[fromToken].approve(
                CONFIG.DEX.address,
                amountIn
            );
            await approveTx.wait();
            
            // Execute swap
            const swapTx = await this.wallet.contracts.DEX.swap(
                CONFIG.TOKENS[fromToken].address,
                amountIn
            );
            await swapTx.wait();
            
            UI.showSuccess("Swap executed successfully!");
        } catch (error) {
            UI.showError(`Swap failed: ${error.message}`);
        } finally {
            const swapBtn = document.getElementById('swap-btn');
            swapBtn.disabled = false;
            swapBtn.textContent = 'Swap';
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
 async mintToken(tokenName) {
        try {
            const buttonId = `mint-${tokenName.toLowerCase()}`;
            const button = document.getElementById(buttonId);
            
            button.disabled = true;
            button.textContent = 'Minting...';
            
            // Добавляем проверку на существование ethers
            if (!window.ethers && !ethers) {
                throw new Error("Ethers.js not loaded");
            }
            
            const tx = await this.wallet.contracts[tokenName].mint(
                ethers.utils.parseUnits("1000", 18)
            );
            await tx.wait();
            
            UI.showSuccess(`Successfully minted 1000 ${tokenName}`);
        } catch (error) {
            UI.showError(`Minting failed: ${error.message}`);
        } finally {
            const button = document.getElementById(`mint-${tokenName.toLowerCase()}`);
            if (button) {
                button.disabled = false;
                button.textContent = `Mint ${tokenName}`;
            }
        }
    }
}

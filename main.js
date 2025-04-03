import { connectWallet, checkNetwork } from './wallet.js';
import { updateUI } from './ui.js';

// Инициализация
window.onload = () => {
    connectWallet();
    checkNetwork();
};

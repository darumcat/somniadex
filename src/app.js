import { connectWallet, swapTokens, mintToken } from './wallet.js';
import { updateUI, showLoading, hideLoading } from './ui.js';

// Подключение к кошельку
document.getElementById('connectWallet').addEventListener('click', async () => {
    await connectWallet();
});

// Событие для кнопки Swap
document.getElementById('swap').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        // Показать индикатор загрузки
        showLoading();

        // Выполнить обмен
        await swapTokens(amount, 'FDRMCT', 'CRPTHZ');
    } catch (error) {
        console.error("Swap failed:", error);
    } finally {
        // Скрыть индикатор загрузки
        hideLoading();
    }
});

// Событие для кнопки Mint FDRMCT
document.getElementById('mintFDRMCT').addEventListener('click', async () => {
    const amount = document.getElementById('mintAmountFDRMCT').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount for FDRMCT');
        return;
    }

    try {
        // Показать индикатор загрузки
        showLoading();

        // Минт токен FDRMCT
        await mintToken(amount, 'FDRMCT');
    } catch (error) {
        console.error("Mint failed:", error);
    } finally {
        // Скрыть индикатор загрузки
        hideLoading();
    }
});

// Событие для кнопки Mint CRPTHZ
document.getElementById('mintCRPTHZ').addEventListener('click', async () => {
    const amount = document.getElementById('mintAmountCRPTHZ').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount for CRPTHZ');
        return;
    }

    try {
        // Показать индикатор загрузки
        showLoading();

        // Минт токен CRPTHZ
        await mintToken(amount, 'CRPTHZ');
    } catch (error) {
        console.error("Mint failed:", error);
    } finally {
        // Скрыть индикатор загрузки
        hideLoading();
    }
});

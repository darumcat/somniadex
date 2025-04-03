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
        await swapTokens(amount, '0x5a631147bE09F4af9f4f1E817e304D12bDD6Eb22', '0x9757112F515f6c3c8dCe912b595667780F67B3E8');
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

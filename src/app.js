import { connectWallet, swapTokens } from './wallet.js';
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

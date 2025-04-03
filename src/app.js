import { connectWallet, swapTokens } from './wallet.js';
import { updateUI, showLoading, hideLoading } from './ui.js';

document.getElementById('connectWallet').addEventListener('click', async () => {
    await connectWallet();
});

document.getElementById('swap').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    if (amount > 0) {
        await swapTokens(amount, 'FDRMCT', 'CRPTHZ');
    } else {
        alert('Please enter a valid amount');
    }
});

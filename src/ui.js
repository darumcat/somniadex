export class UI {
    static updateWalletInfo(address) {
        const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
        document.getElementById('wallet-status').textContent = 'Connected';
        document.getElementById('wallet-status').style.color = '#28a745';
        document.getElementById('wallet-address').textContent = shortAddress;
        document.getElementById('wallet-address').style.display = 'inline-block';
        document.getElementById('connect-wallet').textContent = 'Disconnect';
    }

    static resetWalletInfo() {
        document.getElementById('wallet-status').textContent = 'Not connected';
        document.getElementById('wallet-status').style.color = '';
        document.getElementById('wallet-address').style.display = 'none';
        document.getElementById('connect-wallet').textContent = 'Connect Wallet';
    }

    static enableButtons() {
        document.getElementById('swap-btn').disabled = false;
        document.getElementById('mint-fdrmct').disabled = false;
        document.getElementById('mint-crpthz').disabled = false;
    }

    static disableButtons() {
        document.getElementById('swap-btn').disabled = true;
        document.getElementById('mint-fdrmct').disabled = true;
        document.getElementById('mint-crpthz').disabled = true;
    }

    static showError(message) {
        alert(`Error: ${message}`);
    }

    static showSuccess(message) {
        alert(`Success: ${message}`);
    }
}

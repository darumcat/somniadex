const NetworkAlert = () => {
  const switchToSomnia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xc488',
          chainName: 'Somnia Testnet',
          nativeCurrency: {
            name: 'Somnia Test Token',
            symbol: 'STT',
            decimals: 18
          },
          rpcUrls: ['https://dream-rpc.somnia.network'],
          blockExplorerUrls: ['https://shannon-explorer.somnia.network/']
        }]
      });
    } catch (error) {
      console.error('Network switch error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="network-alert">
      <div className="alert-content">
        <div className="alert-icon">⚠️</div>
        <div>
          <p>Please connect to <strong>Somnia Testnet</strong> (ChainID: 50312)</p>
          <button onClick={switchToSomnia} className="alert-button">
            Switch Network Automatically
          </button>
          <p className="manual-notice">Or switch manually in MetaMask</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkAlert;

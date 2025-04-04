import { useState } from 'react';

const NetworkAlert = () => {
  const [isMobile] = useState(() => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  const switchToSomnia = async () => {
    try {
      if (window.ethereum) {
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
      } else if (isMobile) {
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}?redirect=${currentUrl}`;
      } else {
        alert('Please install MetaMask to switch networks');
      }
    } catch (error) {
      console.error('Network switch error:', error);
      alert(`Failed to switch network: ${error.message}`);
    }
  };

  return (
    <div className="network-alert">
      <div className="alert-content">
        <div className="alert-icon">⚠️</div>
        <div>
          <p>Please connect to <strong>Somnia Testnet</strong> (ChainID: 50312)</p>
          <button onClick={switchToSomnia} className="alert-button">
            {isMobile && !window.ethereum ? 'Open in MetaMask' : 'Switch Network Automatically'}
          </button>
          {!isMobile && (
            <p className="manual-notice">Or switch manually in MetaMask</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkAlert;

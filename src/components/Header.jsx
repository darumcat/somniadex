import { useEffect } from 'react';

const Header = ({ account, connectWallet }) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleConnect = async () => {
    if (isMobile && !window.ethereum) {
      // 1. Открываем MetaMask с deeplink
      const currentUrl = encodeURIComponent(window.location.href);
      const metamaskUrl = `https://metamask.app.link/dapp/${window.location.hostname}?redirect=${currentUrl}`;
      window.location.href = metamaskUrl;
      return;
    }

    // 2. Если MetaMask доступен (после редиректа или на десктопе)
    try {
      if (window.ethereum) {
        // Этот вызов гарантированно покажет запрос на подключение
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          connectWallet(); // Оповещаем родительский компонент
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // 3. Проверяем возврат из MetaMask
  useEffect(() => {
    if (window.ethereum && isMobile) {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0 && !account) {
            connectWallet();
          }
        } catch (error) {
          console.error('Connection check error:', error);
        }
      };
      checkConnection();
    }
  }, []);

  return (
    <header>
      <h1>Somnia Swap DApp</h1>
      {account ? (
        <button className="connected-wallet">
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </button>
      ) : (
        <button 
          onClick={handleConnect}
          className="connect-button"
        >
          {isMobile ? 'Connect via MetaMask' : 'Connect Wallet'}
        </button>
      )}
    </header>
  );
};

export default Header;

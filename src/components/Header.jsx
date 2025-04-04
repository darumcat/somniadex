const Header = ({ account, connectWallet }) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const handleConnect = () => {
    if (isMobile) {
      // Для мобильных устройств используем deeplink
      const currentUrl = encodeURIComponent(window.location.href);
      const metamaskUrl = `https://metamask.app.link/dapp/${window.location.hostname}?redirect=${currentUrl}`;
      window.location.href = metamaskUrl;
    } else {
      // Для десктопов стандартное подключение
      connectWallet();
    }
  };

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
          {isMobile ? 'Open in MetaMask' : 'Connect Wallet'}
        </button>
      )}
    </header>
  );
};

export default Header;

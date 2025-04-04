const Header = ({ account, connectWallet }) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return (
    <header>
      <h1>Somnia Swap DApp</h1>
      {account ? (
        <button className="connected-wallet">
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </button>
      ) : (
        <button 
          onClick={isMobile ? () => window.open('https://metamask.app.link/dapp/' + window.location.hostname) : connectWallet} 
          className="connect-button"
        >
          {isMobile ? 'Open in MetaMask' : 'Connect Wallet'}
        </button>
      )}
    </header>
  );
};

export default Header;

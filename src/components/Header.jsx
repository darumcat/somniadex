const Header = ({ account, connectWallet }) => {
  return (
    <header>
      <h1>Somnia Swap DApp</h1>
      {account ? (
        <button className="connected-wallet">
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </button>
      ) : (
        <button onClick={connectWallet} className="connect-button">
          Подключить кошелек
        </button>
      )}
    </header>
  );
};

export default Header;
import { useEffect, useState } from 'react';
import Header from './components/Header';
import SwapCard from './components/SwapCard';
import MintCard from './components/MintCard';
import NetworkAlert from './components/NetworkAlert';
import './styles/globals.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [isSomniaNetwork, setIsSomniaNetwork] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsSomniaNetwork(chainId === '0xc488'); // 50312 в hex
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      await checkNetwork();
    } else {
      alert('Установите MetaMask!');
    }
  };

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setShowMobileWarning(isMobile && !window.ethereum);
    checkNetwork();
    window.ethereum?.on('chainChanged', checkNetwork);
    return () => {
      window.ethereum?.removeListener('chainChanged', checkNetwork);
    };
  }, []);

  return (
    <div className="app">
      {showMobileWarning && (
        <div className="mobile-warning">
          <h3>Для работы с DApp требуется MetaMask</h3>
          <p>Пожалуйста, откройте этот сайт в браузере MetaMask</p>
          <button 
            onClick={() => window.open('https://metamask.app.link/dapp/' + window.location.hostname)}
            className="mobile-button"
          >
            Открыть в MetaMask
          </button>
          <button 
            onClick={() => setShowMobileWarning(false)}
            className="mobile-button secondary"
          >
            Продолжить в браузере (ограниченный функционал)
          </button>
        </div>
      )}
      <Header account={account} connectWallet={connectWallet} />
      {!isSomniaNetwork && <NetworkAlert />}
      <div className="dashboard">
        <SwapCard account={account} isSomniaNetwork={isSomniaNetwork} />
        <MintCard account={account} isSomniaNetwork={isSomniaNetwork} />
      </div>
    </div>
  );
};

export default App;

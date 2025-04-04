import { useEffect, useState } from 'react';
import Header from './components/Header';
import SwapCard from './components/SwapCard';
import MintCard from './components/MintCard';
import NetworkAlert from './components/NetworkAlert';
import './styles/globals.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [isSomniaNetwork, setIsSomniaNetwork] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setIsSomniaNetwork(chainId === '0xc488');
      } catch (error) {
        console.error("Network check error:", error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) {
        if (isMobile) {
          setShowMobileGuide(true);
          return;
        }
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await checkNetwork();
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert(`Connection failed: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    // Проверка возврата из MetaMask
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('metamask_redirect')) {
      setTimeout(connectWallet, 1000);
    }

    // Проверка начального состояния
    const init = async () => {
      await checkNetwork();
      
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    
    init();

    // Обработчики изменений
    const handleAccountsChanged = (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : '');
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', checkNetwork);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', checkNetwork);
      };
    }
  }, []);

  if (showMobileGuide) {
    return (
      <div className="mobile-guide">
        <h2>How to Connect</h2>
        <div className="guide-steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Open this link in MetaMask browser</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p>Tap the "Connect" button</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Approve the connection</p>
          </div>
        </div>
        <button 
          onClick={() => {
            const url = encodeURIComponent(window.location.href.split('?')[0]);
            window.location.href = `https://metamask.app.link/browser?url=${url}`;
          }}
          className="action-btn"
        >
          {isConnecting ? (
            <>
              <span className="spinner"></span>
              Opening...
            </>
          ) : (
            'Open in MetaMask'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <Header account={account} connectWallet={connectWallet} isConnecting={isConnecting} />
      {!isSomniaNetwork && <NetworkAlert />}
      <div className="dashboard">
        <SwapCard account={account} isSomniaNetwork={isSomniaNetwork} />
        <MintCard account={account} isSomniaNetwork={isSomniaNetwork} />
      </div>
    </div>
  );
};

export default App;

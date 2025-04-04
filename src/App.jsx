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
  const [showMobileRedirect, setShowMobileRedirect] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsSomniaNetwork(chainId === '0xc488');
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) {
        if (isMobile) {
          setShowMobileRedirect(true);
          return;
        }
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await checkNetwork();
        
        // Для мобильных - обновляем страницу после подключения
        if (isMobile) {
          window.location.reload();
        }
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
    
    if (mobileCheck && !window.ethereum) {
      setShowMobileRedirect(true);
    }

    checkNetwork();
    
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount('');
      }
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Проверяем уже подключенные аккаунты
      const checkInitialConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await checkNetwork();
          }
        } catch (error) {
          console.error("Initial connection check error:", error);
        }
      };
      
      checkInitialConnection();
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  if (showMobileRedirect) {
    return (
      <div className="mobile-redirect-screen">
        <h2>Redirecting to MetaMask...</h2>
        <p>Please connect your wallet in MetaMask</p>
        <p>You'll be automatically returned to the app</p>
        <button 
          onClick={() => {
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}?redirect=${currentUrl}`;
          }}
          className="mobile-button"
        >
          Open MetaMask Again
        </button>
        
        {/iPhone|iPad|iPod/i.test(navigator.userAgent) && (
          <button
            onClick={() => window.location.href = 'https://apps.apple.com/app/metamask/id1438144202'}
            className="mobile-button secondary"
          >
            Install MetaMask from App Store
          </button>
        )}
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

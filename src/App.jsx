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

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsSomniaNetwork(chainId === '0xc488');
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await checkNetwork();
        }
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else if (isMobile) {
      // Для мобильных без MetaMask открываем Deep Link
      window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`;
    } else {
      alert('Please install MetaMask!');
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
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // Если пользователь вернулся после подключения
  useEffect(() => {
    if (window.ethereum && isMobile) {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await checkNetwork();
          }
        } catch (error) {
          console.error("Connection check error:", error);
        }
      };
      
      checkConnection();
    }
  }, [isMobile]);

  if (showMobileRedirect) {
    return (
      <div className="mobile-redirect-screen">
        <h2>Redirecting to MetaMask...</h2>
        <p>Please connect your wallet in MetaMask</p>
        <p>You'll be automatically returned to the app</p>
        <button 
          onClick={() => window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`}
          className="mobile-button"
        >
          Open MetaMask Again
        </button>
      </div>
    );
  }

  return (
    <div className="app">
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

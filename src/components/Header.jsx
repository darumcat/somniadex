import { useEffect } from 'react';

const Header = ({ account, connectWallet }) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleConnect = async () => {
    if (isMobile) {
      // Для мобильных устройств
      if (!window.ethereum) {
        // Сохраняем флаг ожидания аутентификации
        sessionStorage.setItem('pendingAuth', 'true');
        const currentUrl = encodeURIComponent(window.location.href);
        const metamaskUrl = `https://metamask.app.link/dapp/${window.location.hostname}?redirect=${currentUrl}`;
        
        // Пытаемся открыть MetaMask
        window.location.href = metamaskUrl;
        
        // Fallback для iOS, если MetaMask не установлен
        setTimeout(() => {
          if (!window.ethereum && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = 'https://apps.apple.com/app/metamask/id1438144202';
          }
        }, 500);
      } else {
        // Если MetaMask уже доступен, подключаемся
        await connectWallet();
      }
    } else {
      // Для десктопов
      await connectWallet();
    }
  };

  // Проверяем возврат из MetaMask
  useEffect(() => {
    const checkConnectionOnReturn = async () => {
      if (sessionStorage.getItem('pendingAuth') && window.ethereum) {
        try {
          await connectWallet();
          sessionStorage.removeItem('pendingAuth');
          
          // Обновляем страницу для мобильных, чтобы синхронизировать состояние
          if (isMobile) {
            window.location.reload();
          }
        } catch (error) {
          console.error('Connection error after redirect:', error);
        }
      }
    };

    checkConnectionOnReturn();
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
          disabled={isMobile && !window.ethereum && sessionStorage.getItem('pendingAuth')}
        >
          {isMobile ? (
            window.ethereum ? 'Connect Wallet' : 'Open in MetaMask'
          ) : (
            'Connect Wallet'
          )}
        </button>
      )}
    </header>
  );
};

export default Header;

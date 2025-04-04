const NetworkAlert = () => {
  const switchToSomnia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xc488', // 50312 в HEX
          chainName: 'Somnia Testnet',
          nativeCurrency: {
            name: 'Somnia Test Token',
            symbol: 'STT', // Убедитесь, что это правильный символ
            decimals: 18
          },
          rpcUrls: ['https://dream-rpc.somnia.network'],
          blockExplorerUrls: ['https://shannon-explorer.somnia.network/'],
          iconUrls: ['https://somnia.network/icon.png'] // Опционально
        }]
      });
    } catch (error) {
      console.error('Ошибка переключения сети:', error);
      
      // Улучшенная обработка ошибок
      if (error.code === 4001) {
        alert('Вы отменили переключение сети');
      } else if (error.code === -32602) {
        alert('Некорректные параметры сети. Пожалуйста, сообщите разработчикам.');
      } else {
        alert(`Ошибка переключения сети: ${error.message}`);
      }
    }
  };

  return (
    <div className="network-alert">
      <p>⚠️ Подключитесь к <strong>Somnia Testnet</strong> (ChainID: 50312) для работы с DApp.</p>
      <button onClick={switchToSomnia}>Автопереключение</button>
      <p>Или сделайте это вручную в MetaMask.</p>
    </div>
  );
};

export default NetworkAlert;

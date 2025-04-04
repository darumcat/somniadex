const NetworkAlert = () => {
  const switchToSomnia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xc4a8', // 50312 в hex
          chainName: 'Somnia Testnet',
          nativeCurrency: {
            name: 'STT',
            symbol: 'STT',
            decimals: 18
          },
          rpcUrls: ['https://dream-rpc.somnia.network/'],
          blockExplorerUrls: ['https://shannon-explorer.somnia.network/']
        }]
      });
    } catch (error) {
      console.error('Ошибка переключения сети:', error);
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
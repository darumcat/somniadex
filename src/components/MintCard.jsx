import { useState } from 'react';
import { ethers } from 'ethers';
import { GRTS, WNDRS } from '../contracts/contracts';

const MintCard = ({ account, isSomniaNetwork }) => {
  const [token, setToken] = useState('GRTS');
  const [amount, setAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!account || !isSomniaNetwork || !amount) return;
    setIsMinting(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        token === 'GRTS' ? GRTS.address : WNDRS.address,
        token === 'GRTS' ? GRTS.abi : WNDRS.abi,
        signer
      );

      // Проверка лимита (не более 100k токенов)
      const amountWei = ethers.parseUnits(amount, 18);
      if (amountWei > ethers.parseUnits('100000', 18)) {
        throw new Error('Максимум 100,000 токенов за раз');
      }

      const tx = await tokenContract.mint(account, amountWei);
      await tx.wait();
      alert(`Успешно заминчено ${amount} ${token}!`);
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Ошибка: ' + (error.reason || error.message));
    } finally {
      setIsMinting(false);
    }
  };

 return (
    <div className="card mint-card">
      <h2>Минтинг токенов</h2>
      <div className="input-group">
        <input
          type="number"
          placeholder="Количество (макс. 100,000)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max="100000"
          min="1"
        />
      </div>
      <div className="token-selection">
        <div 
          className={`token-option ${token === 'GRTS' ? 'active' : ''}`}
          onClick={() => setToken('GRTS')}
        >
          <img src="/assets/grts-logo.png" alt="GRTS" className="token-icon" />
          <span>GreatSomnia (GRTS)</span>
        </div>
        <div 
          className={`token-option ${token === 'WNDRS' ? 'active' : ''}`}
          onClick={() => setToken('WNDRS')}
        >
          <img src="/assets/wndrs-logo.png" alt="WNDRS" className="token-icon" />
          <span>WonderfulSomnia (WNDRS)</span>
        </div>
      </div>
      <button
        onClick={handleMint}
        disabled={!account || !isSomniaNetwork || !amount || isMinting}
      >
        {isMinting ? 'Минтинг...' : 'Заминтить'}
      </button>
    </div>
  );
};

export default MintCard;

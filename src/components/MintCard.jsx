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
        <select value={token} onChange={(e) => setToken(e.target.value)}>
          <option value="GRTS">GreatSomnia (GRTS)</option>
          <option value="WNDRS">WonderfulSomnia (WNDRS)</option>
        </select>
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
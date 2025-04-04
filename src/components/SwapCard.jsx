import { useState } from 'react';
import { ethers } from 'ethers';
import { GRTS, WNDRS, SWAP_CONTRACT } from '../contracts/contracts';

const SwapCard = ({ account, isSomniaNetwork }) => {
  const [fromToken, setFromToken] = useState('GRTS');
  const [amount, setAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = async () => {
    if (!account || !isSomniaNetwork || !amount) return;
    setIsSwapping(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        fromToken === 'GRTS' ? GRTS.address : WNDRS.address,
        fromToken === 'GRTS' ? GRTS.abi : WNDRS.abi,
        signer
      );

      // Approve
      const txApprove = await tokenContract.approve(
        SWAP_CONTRACT.address,
        ethers.parseUnits(amount, 18)
      );
      await txApprove.wait();

      // Swap
      const swapContract = new ethers.Contract(
        SWAP_CONTRACT.address,
        SWAP_CONTRACT.abi,
        signer
      );
      const swapTx = fromToken === 'GRTS'
        ? await swapContract.swapGRTStoWNDRS(ethers.parseUnits(amount, 18))
        : await swapContract.swapWNDRStoGRTS(ethers.parseUnits(amount, 18));
      await swapTx.wait();

      alert('Успешный обмен!');
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Ошибка: ' + error.message);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="card swap-card">
      <h2>Обмен токенов</h2>
      <div className="input-group">
        <input
          type="number"
          placeholder="Количество"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
          <option value="GRTS">GRTS → WNDRS</option>
          <option value="WNDRS">WNDRS → GRTS</option>
        </select>
      </div>
      <button
        onClick={handleSwap}
        disabled={!account || !isSomniaNetwork || !amount || isSwapping}
      >
        {isSwapping ? 'Обмен...' : 'Обменять'}
      </button>
    </div>
  );
};

export default SwapCard;
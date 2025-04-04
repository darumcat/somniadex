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

      const txApprove = await tokenContract.approve(
        SWAP_CONTRACT.address,
        ethers.parseUnits(amount, 18)
      );
      await txApprove.wait();

      const swapContract = new ethers.Contract(
        SWAP_CONTRACT.address,
        SWAP_CONTRACT.abi,
        signer
      );
      const swapTx = fromToken === 'GRTS'
        ? await swapContract.swapGRTStoWNDRS(ethers.parseUnits(amount, 18))
        : await swapContract.swapWNDRStoGRTS(ethers.parseUnits(amount, 18));
      await swapTx.wait();

      alert('Swap successful!');
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="card">
      <h2>Token Swap</h2>
      
      <div className="input-section">
        <label className="amount-label">Swap Amount:</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="swap-input"
        />
      </div>

      <div className="swap-direction">
        <h3>Swap Direction:</h3>
        <div className="direction-options">
          <button
            className={`direction-btn ${fromToken === 'GRTS' ? 'active' : ''}`}
            onClick={() => setFromToken('GRTS')}
          >
            <div className="token-direction">
              <div className="token-pair">
                <img src="/assets/grts-logo.png" alt="GRTS" className="token-icon" />
                <span className="arrow-icon">→</span>
                <img src="/assets/wndrs-logo.png" alt="WNDRS" className="token-icon" />
              </div>
              <span className="direction-label">GRTS to WNDRS</span>
            </div>
          </button>
          <button
            className={`direction-btn ${fromToken === 'WNDRS' ? 'active' : ''}`}
            onClick={() => setFromToken('WNDRS')}
          >
            <div className="token-direction">
              <div className="token-pair">
                <img src="/assets/wndrs-logo.png" alt="WNDRS" className="token-icon" />
                <span className="arrow-icon">→</span>
                <img src="/assets/grts-logo.png" alt="GRTS" className="token-icon" />
              </div>
              <span className="direction-label">WNDRS to GRTS</span>
            </div>
          </button>
        </div>
      </div>

      <button
        className="action-btn"
        onClick={handleSwap}
        disabled={!account || !isSomniaNetwork || !amount || isSwapping}
      >
        {isSwapping ? (
          <>
            <span className="spinner"></span>
            Swapping...
          </>
        ) : (
          'Swap Tokens'
        )}
      </button>
    </div>
  );
};

export default SwapCard;

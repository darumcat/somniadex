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

      const amountWei = ethers.parseUnits(amount, 18);
      if (amountWei > ethers.parseUnits('100000', 18)) {
        throw new Error('Maximum 100,000 tokens per mint');
      }

      const tx = await tokenContract.mint(account, amountWei);
      await tx.wait();
      alert(`Successfully minted ${amount} ${token}!`);
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Error: ' + (error.reason || error.message));
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="card">
      <h2>Mint Tokens</h2>
      
      <div className="input-section">
        <label>Amount (max 100,000):</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max="100000"
          min="1"
        />
      </div>

      <div className="token-choice">
        <h3>Select Token:</h3>
        <div className="token-options">
          <button
            className={`token-btn ${token === 'GRTS' ? 'active' : ''}`}
            onClick={() => setToken('GRTS')}
          >
            <img src="/assets/grts-logo.png" alt="GRTS" />
            <span>GRTS</span>
          </button>
          <button
            className={`token-btn ${token === 'WNDRS' ? 'active' : ''}`}
            onClick={() => setToken('WNDRS')}
          >
            <img src="/assets/wndrs-logo.png" alt="WNDRS" />
            <span>WNDRS</span>
          </button>
        </div>
      </div>

      <button
        className="action-btn"
        onClick={handleMint}
        disabled={!account || !isSomniaNetwork || !amount || isMinting}
      >
        {isMinting ? (
          <>
            <span className="spinner"></span>
            Minting...
          </>
        ) : (
          'Mint Tokens'
        )}
      </button>
    </div>
  );
};

export default MintCard;

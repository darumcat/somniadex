export const CONTRACTS = {
    FDRMCT: "0x5a631147bE09F4af9f4f1E817e304D12bDD6Eb22",
    CRPTHZ: "0x9757112F515f6c3c8dCe912b595667780F67B3E8",
    DEX: "0x3344f77ce1d16a8e223fbb53bf4d1d01384eb8f4"
};

export const PROVIDER_URL = "https://dream-rpc.somnia.network/";

export const DEX_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "_tokenA", "type": "address"},
            {"internalType": "address", "name": "_tokenB", "type": "address"}
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "fromToken", "type": "address"},
            {"internalType": "address", "name": "toToken", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "swap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const TOKEN_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "to", "type": "address"}
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

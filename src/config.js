export const PROVIDER_URL = "https://dream-rpc.somnia.network/";
export const DEX_ABI = [
    // ABI для вашего DEX контракта
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "getSwapRate",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "fromToken",
                "type": "address"
            },
            {
                "name": "toToken",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "swap",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const FDRMCT_ABI = [
    // ABI для контракта FDRMCT
    {
        "constant": false,
        "inputs": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const CRPTHZ_ABI = [
    // ABI для контракта CRPTHZ
    {
        "constant": false,
        "inputs": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const TOKEN_ADDRESSES = {
    FDRMCT: "0x5a631147bE09F4af9f4f1E817e304D12bDD6Eb22",
    CRPTHZ: "0x9757112F515f6c3c8dCe912b595667780F67B3E8"
};

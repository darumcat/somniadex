import { connectWallet } from "./wallet.js";
import { initSwap } from "./swap.js";

document.addEventListener("DOMContentLoaded", () => {
    connectWallet();
    initSwap();
});

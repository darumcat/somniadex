export function updateStatus(message, isError = false) {
    const status = document.getElementById("status");
    if (status) {
        status.textContent = message;
        status.style.color = isError ? "#ff6b6b" : "#4CAF50";
    }
}

export function showLoading() {
    const loader = document.getElementById("loading");
    if (loader) loader.style.display = "flex";
}

export function hideLoading() {
    const loader = document.getElementById("loading");
    if (loader) loader.style.display = "none";
}

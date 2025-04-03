export function updateUI(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
}

export function showLoading() {
    document.getElementById("loading").style.display = "block";
}

export function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

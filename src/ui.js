function updateUI(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = content;
}

function showLoading() {
    const loader = document.getElementById("loadingIndicator");
    if (loader) loader.style.display = "block";
}

function hideLoading() {
    const loader = document.getElementById("loadingIndicator");
    if (loader) loader.style.display = "none";
}

export { updateUI, showLoading, hideLoading };

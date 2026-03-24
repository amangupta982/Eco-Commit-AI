// =========================================================
//  Toast Notification System
//  Usage: showToast("Message here", "success")
//         showToast("Error!", "error")
// =========================================================

function showToast(message, type = "success") {

    // Remove any existing toast
    const existing = document.querySelector(".toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast-notification toast-" + type;

    const icon = type === "success" ? "✓" : "✕";

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger slide-in
    requestAnimationFrame(() => {
        toast.classList.add("toast-visible");
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        toast.classList.remove("toast-visible");
        toast.addEventListener("transitionend", () => toast.remove());
    }, 4000);
}

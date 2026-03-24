document.addEventListener("DOMContentLoaded", async function(){

    // ── Auth guard (token-based) ──
    if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    const nameInput = document.querySelector("input[type='text']");
    const emailInput = document.querySelector("input[type='email']");
    const logoutBtn = document.getElementById("logoutBtn");

    // ── Load user data from API, fallback to cache ──
    try {
        const user = await fetchCurrentUser();
        if (nameInput) nameInput.value = user.name || "";
        if (emailInput) emailInput.value = user.email || "";

        // Update cache
        localStorage.setItem("ecoName", user.name);
        localStorage.setItem("ecoEmail", user.email);

    } catch(err) {
        console.warn("Settings: API fallback to localStorage", err);

        const storedName = localStorage.getItem("ecoName");
        const storedEmail = localStorage.getItem("ecoEmail");

        if (storedName && nameInput) nameInput.value = storedName;
        if (storedEmail && emailInput) emailInput.value = storedEmail;
    }

    // Auto-save when changed (updates localStorage cache)
    if (nameInput) {
        nameInput.addEventListener("change", function(){
            localStorage.setItem("ecoName", nameInput.value.trim());
        });
    }

    if (emailInput) {
        emailInput.addEventListener("change", function(){
            localStorage.setItem("ecoEmail", emailInput.value.trim());
        });
    }

    // ── Logout ──
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(){
            // Clear all auth data
            removeToken();
            localStorage.removeItem("ecoUser");
            localStorage.removeItem("ecoName");
            localStorage.removeItem("ecoEmail");
            localStorage.removeItem("ecoCountry");
            localStorage.removeItem("ecoCity");
            localStorage.removeItem("ecoPoints");

            window.location.href = "home.html";
        });
    }

});
document.getElementById("loginBtn").addEventListener("click", async function(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const loginBtn = document.getElementById("loginBtn");

    // ── Validation ──
    if(!email || !password){
        showToast("Please fill all fields", "error");
        return;
    }

    // ── Disable button while loading ──
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";

    try {
        // 1. Login (sends form-encoded data to /auth/login)
        const data = await loginUser(email, password);
        setToken(data.access_token);

        // 2. Fetch user info and cache it locally
        const user = await fetchCurrentUser();
        localStorage.setItem("ecoUser", "true");
        localStorage.setItem("ecoName", user.name);
        localStorage.setItem("ecoEmail", user.email);
        localStorage.setItem("ecoCountry", user.country || "");
        localStorage.setItem("ecoCity", user.city || "");
        localStorage.setItem("ecoPoints", user.eco_points || 0);

        showToast("Welcome back, " + user.name + "! 🌿", "success");

        // 3. Redirect to dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } catch(err) {
        console.error("Login error:", err);
        showToast(err.detail || "Invalid credentials. Please try again.", "error");

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }

});
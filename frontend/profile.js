document.addEventListener("DOMContentLoaded", async function(){

    // ── Auth guard ──
    if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    const nameElement = document.getElementById("profileName");
    const avatarElement = document.getElementById("profileAvatar");
    const locationElement = document.getElementById("profileLocation");

    // ── Try fetching from API, fallback to localStorage cache ──
    let user = null;

    try {
        user = await fetchCurrentUser();

        // Cache in localStorage for offline/fallback use
        localStorage.setItem("ecoName", user.name);
        localStorage.setItem("ecoEmail", user.email);
        localStorage.setItem("ecoCountry", user.country || "");
        localStorage.setItem("ecoCity", user.city || "");
        localStorage.setItem("ecoPoints", user.eco_points || 0);

    } catch(err) {
        console.warn("Profile API fallback to localStorage:", err);

        // Build user from cache
        user = {
            name: localStorage.getItem("ecoName") || "User",
            email: localStorage.getItem("ecoEmail") || "",
            country: localStorage.getItem("ecoCountry") || "",
            city: localStorage.getItem("ecoCity") || "",
            eco_points: parseInt(localStorage.getItem("ecoPoints")) || 0,
            total_carbon_saved: 0
        };
    }

    // ── Update Name ──
    if (user.name && nameElement) {
        nameElement.textContent = user.name;

        // Create initials
        const initials = user.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

        if (avatarElement) avatarElement.textContent = initials;
    }

    // ── Update Location ──
    if (locationElement) {
        if (user.city && user.country) {
            locationElement.textContent = `📍 ${user.city}, ${user.country}`;
        } else if (user.country) {
            locationElement.textContent = `📍 ${user.country}`;
        } else {
            locationElement.textContent = "📍 Location not set";
        }
    }

    // ── Update stats if elements exist ──
    const statElements = document.querySelectorAll(".stat h3");
    if (statElements.length >= 3) {
        if (user.total_carbon_saved !== undefined) {
            statElements[0].textContent = (user.total_carbon_saved || 0).toFixed(1);
        }
        if (user.eco_points !== undefined) {
            statElements[2].textContent = user.eco_points || 0;
        }
    }

});
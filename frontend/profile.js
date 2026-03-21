document.addEventListener("DOMContentLoaded", function(){

    const isLoggedIn = localStorage.getItem("ecoUser") === "true";

    if(!isLoggedIn){
        window.location.href = "login.html";
        return;
    }

    // Get stored data
    const name = localStorage.getItem("ecoName");
    const country = localStorage.getItem("ecoCountry");
    const city = localStorage.getItem("ecoCity");

    const nameElement = document.getElementById("profileName");
    const avatarElement = document.getElementById("profileAvatar");
    const locationElement = document.getElementById("profileLocation");

    // Update Name
    if(name){
        nameElement.textContent = name;

        // Create initials
        const initials = name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

        avatarElement.textContent = initials;
    }

    // Update Location
    if(city && country){
        locationElement.textContent = `📍 ${city}, ${country}`;
    } else if(country){
        locationElement.textContent = `📍 ${country}`;
    } else {
        locationElement.textContent = "📍 Location not set";
    }

});
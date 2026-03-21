document.addEventListener("DOMContentLoaded", function(){

    const isLoggedIn = localStorage.getItem("ecoUser") === "true";

    if(!isLoggedIn){
        window.location.href = "login.html";
        return;
    }

    const nameInput = document.querySelector("input[type='text']");
    const emailInput = document.querySelector("input[type='email']");
    const logoutBtn = document.getElementById("logoutBtn");

    // Load current user data
    const storedName = localStorage.getItem("ecoName");
    const storedEmail = localStorage.getItem("ecoEmail");

    if(storedName) nameInput.value = storedName;
    if(storedEmail) emailInput.value = storedEmail;

    // Auto-save when changed
    nameInput.addEventListener("change", function(){
        localStorage.setItem("ecoName", nameInput.value.trim());
    });

    emailInput.addEventListener("change", function(){
        localStorage.setItem("ecoEmail", emailInput.value.trim());
    });

    // Logout
    logoutBtn?.addEventListener("click", function(){
        localStorage.removeItem("ecoUser");
        window.location.href = "home.html";
    });

});
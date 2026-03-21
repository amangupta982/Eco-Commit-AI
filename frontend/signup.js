document.addEventListener("DOMContentLoaded", function(){

    const countryInput = document.getElementById("country");
    const cityInput = document.getElementById("city");
    const countryList = document.getElementById("countryList");
    const cityList = document.getElementById("cityList");
    const signupBtn = document.getElementById("signupBtn");

    let allCountries = [];
    let citiesCache = {};
    let currentCities = [];

    // Fetch countries from stable API
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
        .then(res => res.json())
        .then(result => {

            if(!result.data) return;

            allCountries = result.data
                .map(c => c.name)
                .sort((a,b)=>a.localeCompare(b));
        })
        .catch(err => {
            console.error("Country fetch error:", err);
        });

    function show(list){
        list.style.display = "block";
    }

    function hide(list){
        list.style.display = "none";
    }

    function renderCountries(filter = ""){

        countryList.innerHTML = "";

        const filtered = allCountries.filter(country =>
            country.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(country => {

            const div = document.createElement("div");
            div.className = "dropdown-item";
            div.textContent = country;

            div.onclick = function(){
                countryInput.value = country;
                hide(countryList);
                loadCities(country);
            };

            countryList.appendChild(div);
        });

        if(filtered.length > 0){
            show(countryList);
        } else {
            hide(countryList);
        }
    }

    function loadCities(country){

        cityInput.value = "";
        cityInput.disabled = true;
        cityList.innerHTML = "";
        currentCities = [];

        if(citiesCache[country]){
            currentCities = citiesCache[country];
            cityInput.disabled = false;
            return;
        }

        fetch("https://countriesnow.space/api/v0.1/countries/cities",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ country: country })
        })
        .then(res => res.json())
        .then(result => {

            if(!result.data) return;

            citiesCache[country] = result.data.sort((a,b)=>a.localeCompare(b));
            currentCities = citiesCache[country];
            cityInput.disabled = false;
        })
        .catch(err => {
            console.error("City fetch error:", err);
        });
    }

    function renderCities(filter = ""){

        cityList.innerHTML = "";

        const filtered = currentCities.filter(city =>
            city.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(city => {

            const div = document.createElement("div");
            div.className = "dropdown-item";
            div.textContent = city;

            div.onclick = function(){
                cityInput.value = city;
                hide(cityList);
            };

            cityList.appendChild(div);
        });

        if(filtered.length > 0){
            show(cityList);
        } else {
            hide(cityList);
        }
    }

    countryInput.addEventListener("focus", function(){
        renderCountries("");
    });

    countryInput.addEventListener("input", function(){
        renderCountries(countryInput.value);
    });

    cityInput.addEventListener("focus", function(){
        if(currentCities.length > 0){
            renderCities("");
        }
    });

    cityInput.addEventListener("input", function(){
        renderCities(cityInput.value);
    });

    document.addEventListener("click", function(e){
        if(!e.target.closest(".dropdown-group")){
            hide(countryList);
            hide(cityList);
        }
    });

    signupBtn.addEventListener("click", function(){

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const country = countryInput.value.trim();
        const city = cityInput.value.trim();

        if(!fullName || !email || !password || !confirmPassword || !country || !city){
            alert("Please fill all fields");
            return;
        }

        if(password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }

        localStorage.setItem("ecoUser", "true");
        localStorage.setItem("ecoName", fullName);
        localStorage.setItem("ecoEmail", email);
        localStorage.setItem("ecoCountry", country);
        localStorage.setItem("ecoCity", city);

        window.location.href = "dashboard.html";
    });

});
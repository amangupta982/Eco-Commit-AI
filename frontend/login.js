document.getElementById("loginBtn").addEventListener("click", function(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(email && password){
        localStorage.setItem("ecoUser","true");
        localStorage.setItem("ecoEmail",email);
        window.location.href="dashboard.html";
    }else{
        alert("Please fill all fields");
    }

});
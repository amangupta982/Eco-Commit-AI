document.addEventListener("DOMContentLoaded", function(){

    const darkToggle = document.getElementById("darkToggle");

    if(localStorage.getItem("darkMode") === "true"){
        document.body.classList.add("dark");
        if(darkToggle) darkToggle.checked = true;
    }

    if(darkToggle){
        darkToggle.addEventListener("change", function(){
            if(this.checked){
                document.body.classList.add("dark");
                localStorage.setItem("darkMode", "true");
            } else {
                document.body.classList.remove("dark");
                localStorage.setItem("darkMode", "false");
            }
        });
    }

});
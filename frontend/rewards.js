lucide.createIcons();

// ── Auth guard ──
if (typeof isLoggedIn === "function" && !isLoggedIn()) {
    window.location.href = "login.html";
}

/* ============================
   ECOPOINT COUNT (from API)
============================ */
const points = document.getElementById("points");

async function loadEcoPoints() {
    try {
        const user = await fetchCurrentUser();
        const target = user.eco_points || 0;
        animatePoints(target);

        // Update cached points
        localStorage.setItem("ecoPoints", target);
    } catch(e) {
        console.warn("EcoPoints fallback:", e);
        const cached = parseInt(localStorage.getItem("ecoPoints")) || 0;
        animatePoints(cached);
    }
}

function animatePoints(target) {
    let start = 0;
    const step = Math.max(1, Math.floor(target / 60));

    function animate() {
        start += step;

        if (start < target) {
            points.textContent = start;
            requestAnimationFrame(animate);
        } else {
            points.textContent = target;
        }
    }

    animate();
}

loadEcoPoints();


/* =========================
   LEETCODE STYLE CALENDAR
========================= */

const calendar = document.getElementById("calendar");

const today = new Date();
const currentDay = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();

const daysInMonth = new Date(year,month+1,0).getDate();

/* Example activity data (could be fetched later) */
const activityDays = [2,4,7,9,10,14,18];

for(let i=1;i<=daysInMonth;i++){

let day=document.createElement("div");
day.classList.add("day");
day.textContent=i;

/* Past days */
if(i < currentDay){

day.classList.add("past");

day.addEventListener("click",()=>{
alert("Activity details for "+i);
});

/* GREEN DOT */
if(activityDays.includes(i)){

let dot=document.createElement("span");
dot.className="dot";

day.appendChild(dot);

}

}

/* TODAY */
else if(i === currentDay){

day.classList.add("today");

}

/* FUTURE */
else{

day.classList.add("future");

}

calendar.appendChild(day);

}



/* =========================
   LEADERBOARD DATA (API + Fallback)
========================= */

// Hardcoded fallback data
const fallbackLeaderboard = {

city:[
{rank:"🥇",user:"Priya S.",place:"Mumbai",points:"4,200"},
{rank:"🥈",user:"Carlos M.",place:"Madrid",points:"3,850"},
{rank:"🥉",user:"Alex R. (You)",place:"San Francisco",points:"2,540"},
{rank:"4",user:"Yuki T.",place:"Tokyo",points:"2,310"},
{rank:"5",user:"Emma L.",place:"Berlin",points:"2,100"}
],

state:[
{rank:"🥇",user:"Priya S.",place:"Maharashtra",points:"4,200"},
{rank:"🥈",user:"Carlos M.",place:"Madrid Region",points:"3,850"},
{rank:"🥉",user:"Alex R. (You)",place:"California",points:"2,540"},
{rank:"4",user:"Yuki T.",place:"Tokyo Prefecture",points:"2,310"},
{rank:"5",user:"Emma L.",place:"Berlin State",points:"2,100"}
],

country:[
{rank:"🥇",user:"Priya S.",place:"India",points:"4,200"},
{rank:"🥈",user:"Carlos M.",place:"Spain",points:"3,850"},
{rank:"🥉",user:"Alex R. (You)",place:"USA",points:"2,540"},
{rank:"4",user:"Yuki T.",place:"Japan",points:"2,310"},
{rank:"5",user:"Emma L.",place:"Germany",points:"2,100"}
],

global:[
{rank:"🥇",user:"Priya S.",place:"India",points:"4,200"},
{rank:"🥈",user:"Carlos M.",place:"Spain",points:"3,850"},
{rank:"🥉",user:"Alex R. (You)",place:"USA",points:"2,540"},
{rank:"4",user:"Yuki T.",place:"Japan",points:"2,310"},
{rank:"5",user:"Emma L.",place:"Germany",points:"2,100"}
]

};


/* =========================
   LEADERBOARD SWITCHER
========================= */

const filter=document.getElementById("leaderFilter");
const tableBody=document.getElementById("leaderboardBody");
const header=document.getElementById("locationHeader");


async function renderLeaderboard(type){

tableBody.innerHTML="";

let data = null;

// Try API first
try {
    const userCity = localStorage.getItem("ecoCity") || "Unknown";
    const userState = localStorage.getItem("ecoState") || "Unknown";
    const userCountry = localStorage.getItem("ecoCountry") || "Unknown";

    let value = userCity;
    if (type === "state") value = userState;
    if (type === "country") value = userCountry;
    if (type === "global") value = "global";

    const apiData = await fetchLeaderboard(type, value);

    if (Array.isArray(apiData) && apiData.length > 0) {
        // Transform API data to display format
        data = apiData.map((row, i) => {
            const rank = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : String(i + 1);
            return {
                rank: rank,
                user: row.name || row.user || "User",
                place: row.city || row.place || "",
                points: (row.eco_points || row.points || 0).toLocaleString()
            };
        });
    }
} catch(e) {
    console.warn("Leaderboard API fallback:", e);
}

// Fallback to hardcoded data
if (!data || data.length === 0) {
    data = fallbackLeaderboard[type] || [];
}

data.forEach(row=>{

let tr=document.createElement("tr");

if(row.user.includes("(You)")) tr.classList.add("you");

tr.innerHTML=`

<td>${row.rank}</td>
<td>${row.user}</td>
<td>${row.place}</td>
<td>${row.points}</td>

`;

tableBody.appendChild(tr);

});

header.textContent=type.charAt(0).toUpperCase()+type.slice(1);

}

filter.addEventListener("change",(e)=>{

renderLeaderboard(e.target.value);

});


renderLeaderboard("city");
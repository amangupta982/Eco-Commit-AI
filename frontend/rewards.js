lucide.createIcons();

/* ECOPOINT COUNT */
const points = document.getElementById("points");
let target = 2540;
let start = 0;

function animate(){
start += 40;

points.textContent = start;

if(start < target){
requestAnimationFrame(animate);
}else{
points.textContent = target;
}
}

animate();


/* =========================
   LEETCODE STYLE CALENDAR
========================= */

const calendar = document.getElementById("calendar");

const today = new Date();
const currentDay = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();

const daysInMonth = new Date(year,month+1,0).getDate();

/* Example activity data */
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
   LEADERBOARD DATA
========================= */

const leaderboardData = {

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


function renderLeaderboard(type){

tableBody.innerHTML="";

leaderboardData[type].forEach(row=>{

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
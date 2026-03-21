lucide.createIcons();

/* ================= COUNT ANIMATION ================= */
document.querySelectorAll(".count").forEach(el=>{
let target=parseFloat(el.dataset.target);
let suffix=el.dataset.suffix||"";
let prefix=el.dataset.prefix||"";
let duration=1400,startTime=null;

function animate(t){
if(!startTime)startTime=t;
let progress=Math.min((t-startTime)/duration,1);
let ease=1-Math.pow(1-progress,3);
let value=(target*ease).toFixed(target%1?1:0);
el.textContent=prefix+value+suffix;
if(progress<1)requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
});

/* ================= TRANSPORT BUTTON TOGGLE ================= */
const buttons=document.querySelectorAll(".tbtn");
let selectedMode="Walk";

buttons.forEach(btn=>{
btn.addEventListener("click",()=>{
buttons.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
selectedMode=btn.dataset.mode;
});
});

/* ================= REAL GPS TRACKING SYSTEM ================= */
const goalInput=document.getElementById("goalInput");
const goalDisplay=document.getElementById("goalDisplay");
const progressKm=document.getElementById("progressKm");
const range=document.getElementById("range");
const trackBtn=document.getElementById("trackBtn");

let watchId=null;
let totalDistance=0;
let previousPosition=null;
let tracking=false;

if(goalInput){
goalInput.addEventListener("input",()=>{
goalDisplay.textContent=goalInput.value;
});
}

/* Haversine Formula */
function calculateDistance(lat1,lon1,lat2,lon2){
const R=6371;
const dLat=(lat2-lat1)*Math.PI/180;
const dLon=(lon2-lon1)*Math.PI/180;
const a=
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*Math.sin(dLon/2);
const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
return R*c;
}

if(trackBtn){
trackBtn.addEventListener("click",()=>{

if(!tracking){

if(!navigator.geolocation){
alert("Geolocation not supported.");
return;
}

let goal=parseFloat(goalInput.value);
if(!goal || goal<=0){
alert("Set a valid goal first.");
return;
}

tracking=true;
trackBtn.textContent="Stop Tracking";
trackBtn.style.background="#c62828";
totalDistance=0;
previousPosition=null;

watchId=navigator.geolocation.watchPosition(position=>{

let {latitude,longitude}=position.coords;

if(previousPosition){
let dist=calculateDistance(
previousPosition.latitude,
previousPosition.longitude,
latitude,
longitude
);
totalDistance+=dist;
}

previousPosition={latitude,longitude};

progressKm.textContent=totalDistance.toFixed(2);

let percent=(totalDistance/goal)*100;
if(percent>100)percent=100;

range.value=percent;
range.style.background=
`linear-gradient(to right,#2e7d32 ${percent}%,#d9e3df ${percent}%)`;

},{enableHighAccuracy:true});

}else{

navigator.geolocation.clearWatch(watchId);
tracking=false;
trackBtn.textContent="Start Tracking";
trackBtn.style.background="linear-gradient(90deg,#2e7d32,#1f4fa3)";
}
});
}

/* ================= SAFE AI STATUS ================= */
const predict=document.getElementById("predict");

if(predict){
setTimeout(()=>{
predict.textContent="✓ Complete";
predict.className="done";
},2500);
}

/* ================= CHART CONFIG ================= */
const base={
responsive:true,
maintainAspectRatio:false,
interaction:{mode:'index',intersect:false},
plugins:{legend:{display:false}},
scales:{
x:{grid:{color:'rgba(0,0,0,.08)',borderDash:[4,4]}},
y:{grid:{color:'rgba(0,0,0,.08)',borderDash:[4,4]}}
}
};

/* ================= CHARTS ================= */
const lineCanvas=document.getElementById("lineChart");
if(lineCanvas){
new Chart(lineCanvas,{
type:'line',
data:{
labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
datasets:[{
data:[1.6,2.4,1.2,3.1,2.8,1.5,2.0],
borderColor:'#2e7d32',
tension:.45,
pointRadius:5
}]
},
options:base
});
}

const pieCanvas=document.getElementById("pieChart");
if(pieCanvas){
new Chart(pieCanvas,{
type:'doughnut',
data:{
labels:['Walking','Bus','Bike','No AC'],
datasets:[{
data:[30,25,20,25],
backgroundColor:['#2e7d32','#1f4fa3','#10b981','#f4c542'],
borderWidth:0
}]
},
options:{cutout:'72%'}
});
}

const barCanvas=document.getElementById("barChart");
if(barCanvas){
new Chart(barCanvas,{
type:'bar',
data:{
labels:['Jan','Feb','Mar','Apr','May','Jun'],
datasets:[{
data:[30,38,45,40,52,47],
backgroundColor:'#2e7d32',
borderRadius:8
}]
},
options:base
});
}

const areaCanvas=document.getElementById("areaChart");
if(areaCanvas){
new Chart(areaCanvas,{
type:'line',
data:{
labels:['Jan','Feb','Mar','Apr','May','Jun'],
datasets:[{
data:[32,38,45,41,52,48],
borderColor:'#2e7d32',
backgroundColor:'rgba(46,125,50,.15)',
fill:true,
tension:.45
}]
},
options:base
});
}
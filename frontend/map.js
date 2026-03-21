var map = L.map('map').setView([20,0],2)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:6,
minZoom:2
}).addTo(map)

function cluster(lat,lng,count){

let arr=[]

for(let i=0;i<count;i++){

let latOffset = lat + (Math.random()-0.5)*5
let lngOffset = lng + (Math.random()-0.5)*5

arr.push([latOffset,lngOffset,1])

}

return arr

}

let heatData=[

...cluster(37.77,-122.41,80),
...cluster(40.71,-74.00,80),
...cluster(51.50,-0.12,60),
...cluster(48.85,2.35,60),
...cluster(28.61,77.20,120),
...cluster(19.07,72.87,100),
...cluster(35.68,139.69,80),
...cluster(31.23,121.47,90),
...cluster(-33.86,151.20,60),
...cluster(-23.55,-46.63,70),
...cluster(52.52,13.40,60),
...cluster(55.75,37.61,50)

]

L.heatLayer(heatData,{
radius:35,
blur:25,
maxZoom:5
}).addTo(map)

setTimeout(()=>{
map.invalidateSize()
},300)
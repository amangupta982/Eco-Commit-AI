let points = 2540;

function donateTree(cost){

if(points >= cost){

points -= cost;

alert("Tree planted successfully!");

}else{

alert("Not enough EcoPoints");

}

}
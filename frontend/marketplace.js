let points = 2540;

function buyProduct(cost){

if(points >= cost){

points -= cost;

alert("Product redeemed successfully!");

}else{

alert("Not enough EcoPoints");

}

}
let points = 2540;

function claimVoucher(cost){

if(points >= cost){

points -= cost;

let code = "ECO" + Math.floor(Math.random()*9999);

alert("Voucher Code: " + code);

}else{

alert("Not enough EcoPoints");

}

}
// ====================================================================================================
//
// Cloud Code for adjustPlayerbalance, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

var amount = Spark.getData().amount;

var player = Spark.getPlayer();
if(amount > 0){
    //credit
       player.credit('COINS',amount, "Slot game win");
}else if(amount< 0){
 
       //debit
    player.debit('COINS',-1*amount, "Slot game loss");
}
Spark.getLog().info({'amountX':amount})
var balance = player.getBalance('COINS');
Spark.setScriptData('balance', balance)
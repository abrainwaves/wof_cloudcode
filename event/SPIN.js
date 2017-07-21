// ====================================================================================================
//
// Cloud Code for SPIN, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

//added a change here!!!
var url = "http://ec2-52-34-120-113.us-west-2.compute.amazonaws.com/spin";
// var url = "http://util1.mesmo.tv:8480/spin";
// // var jsonForm = {
// // "betUnit":1,
// // "summURL":"http://s3.amazonaws.com/mesmotv.test.static/uploads/summ/mobile/test/wof_slot_pilot.json"
// // } 

// var jsonForm = {
// "summURL":"http://s3.amazonaws.com/mesmotv.test.static/uploads/summ/mobile/test/wof_slot_pilot.json",
// "betUnit":1
// } 

var player = Spark.getPlayer();
var betUnit = Spark.getData().betUnit;
var jsonForm = {"summURL":Spark.getData().summURL, "betUnit": betUnit} 
var result = Spark.getHttp(url).postJson(jsonForm).getResponseJson();

var amount = result.tokensEarned - betUnit;
//Spark.logEvent("adjustPlayerBalance", {"amount": amount});

//todo: why cant i call an event from an event???
    // var request = new SparkRequests.LogEventRequest()
    // request.scriptData = {"amount":amount};
    // request.eventKey = 'adjustPlayerBalance';
    // var response = request.Send();
    
    // Spark.logEvent(eventKey, values)

// var scriptData = response.scriptData;
adjustBalance(amount)

// Spark.getLog().debug({"result": result.getResponseJson()});
Spark.setScriptData("result", result);


function adjustBalance(amount){

    if(amount > 0){
        //credit
           player.credit('COINS',amount, "Slot game win");
    }else if(amount< 0){
           //debit
        player.debit('COINS',-1*amount, "Slot game loss");
    }
}
/*var betUnit = Spark.getData().betUnit;//donsnt aloways work WTF?
var player = Spark.getPlayer();
var currentBalance = player.getBalance("COINS");
//var symbolsToUse = ['A','B','C','D','E','F'];
var alength = 7;
var reelCount = 3;
var payout = 0;
var reels = [];
var xp = 10;
//Spark.getLog().info("Simple string logging");
for(var i=0; i<reelCount; i++){
 reels.push(Math.floor(Math.random()*alength));
}
Spark.getLog().info({"betunit":betUnit,"reels":reels});
payout = calculatePayout(winValue(reels),betUnit);
//payout = payOut(3,betUnit);

  Spark.getPlayer().credit("XP", xp, "SPIN xp");
  Spark.getPlayer().credit("COINS", payout, "wheelspin");

Spark.getPlayer()
var result = {
    "experiencePoints": xp,
    "totalPayout": payout,
    "reels": reels,
    "coinBalance": player.getBalance("COINS"), 
    "xpBalance": player.getBalance("XP")
    };
    
  
Spark.getLog().info({"result":result});
Spark.setScriptData("result", result);
////-------------

       function winValue(result){
            var map = {};
            var max = 0;
            for(var i in result){
          
                var value = result[i];
                 map[value] =  (!map[value])? 1:map[value]+1;  
            }
    
          for (var property in map) {
            if (map.hasOwnProperty(property) && map[property]>max) {
               max = map[property];
            }
            }
            return max;
        }
        
        

    function calculatePayout(winValue, betUnit){
        var apayout = 0;
        if(winValue > 1){
         apayout = betUnit * winValue;
        }
        return apayout;
    }
    
    */
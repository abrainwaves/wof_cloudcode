// ====================================================================================================
//
// Cloud Code for Get_Pos, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
  var POS = Spark.getPlayer().getScriptData("POSVAR");

    Spark.setScriptData("POS", POS);
// ====================================================================================================
//
// Cloud Code for Set_Pos, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
  var POSV = Spark.getData().POS;

    Spark.getPlayer().setScriptData("POSVAR", POSV);
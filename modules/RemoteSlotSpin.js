var remoteSlotSpin = {};
(function(context) {

    context.getSpin = function(url, betUnit, state) {
        var jsonForm = {"summURL":url, "betUnit": betUnit, "state":state}
        var result = Spark.getHttp(url).postJson(jsonForm).getResponseJson();
        return result;
    };


})(remoteSlotSpin);


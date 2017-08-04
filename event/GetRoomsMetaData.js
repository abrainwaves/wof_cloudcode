// ====================================================================================================
//
// Cloud Code for GetRoomsMetaData, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
var roomsDataCursor = Spark.metaCollection("rooms").find();

var startIndex = Spark.getData().startIndex;
var roomsCount = Spark.getData().roomsCount;

var requestedRooms = new Array();
roomsDataCursor.skip(startIndex);
for (i = startIndex; i < roomsDataCursor.count() & i < startIndex + roomsCount; i++)
{
    if (roomsDataCursor.hasNext())
    {
        requestedRooms.push(roomsDataCursor.next());
    }
}

Spark.setScriptData("requestedRooms", requestedRooms);
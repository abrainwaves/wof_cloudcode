// ====================================================================================================
//
// Cloud Code for Quests_AdminPanel, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
require("Quests_Runtime");

// makes an object deepcloning
function deepClone(data)
{
    return JSON.parse( JSON.stringify( data ) );
}

// checks if string is null or empty
function isNullOrEmpty(string) 
{
    return (!string || 0 === string.length);
}

// returns true if string 'n' is number
function isNumber(n) 
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// adds unique non-null value to an array
function addUniqueValueToArray(array, value)
{
    if(value !== null && array.indexOf(value) < 0)
    {
        array.push(value);
    }
}

// merges two arrays removing duplicate elements
function mergeArraysWithoutDuplicates(arrayA, arrayB)
{
    var arrayC = arrayA.concat(arrayB.filter(function (item) 
        {
            return arrayA.indexOf(item) < 0;
        }
    ));
    
    return arrayC;
}

// removes 'arrayToRemove' items from 'mainArray'
function removeFromArray(mainArray, arrayToRemove)
{
    var result = mainArray.filter( function( el ) {
        return arrayToRemove.indexOf( el ) < 0;
    } );
    
    return result;
}

// simply adds key to all string values
function convertStringArrayToObject( key, stringArray )
{
    var result = [];
    for(var i = 0; i<stringArray.length; ++i)
    {
        result.push( { key : stringArray[i] } );
    }
    
    return result;
}

// turns [ "a", "b" ] to [ { "key":"a" }, { "key":"b", "isSelected":"true" } ]
function makeStringArraySelectionObject( stringArray, stringToMatch)
{
    var resultArray = [];
    for(var i = 0; i<stringArray.length; ++i)
    {
        if(stringArray[i] === stringToMatch)   
        {
            resultArray.push( { "key" : stringArray[i], "isSelected" : "true" } );
        }
        else
        {
            resultArray.push( { "key" : stringArray[i] } );
        }
    }
    
    return resultArray;
}

function findIndexByKeyValue(array, key, value) 
{
    for (var i = 0; i < array.length; i++) 
    {
        if (array[i][key] == value) 
        {
            return i;
        }
    }
    
    return -1;
}

// converts string "a=v;c=12;d=e" to { "a":"v", "c":12, "d":"e" }
function customDataStringToObject( customDataString )
{
    if( isNullOrEmpty( customDataString ) )
    {
        return null;
    }

    var resultObj = {};

    var pairArray = customDataString.split(";");
    for(var i = 0; i<pairArray.length; ++i)
    {
        var keyValue = pairArray[i].split("=");
        if( isNumber( keyValue[1] ) )
        {
            resultObj[ keyValue[0] ] = parseInt( keyValue[1] );
        }
        else
        {
            resultObj[ keyValue[0] ] = keyValue[1];
        }
    }

    return resultObj;
}

// converts simple object without nesting to customData string
function customDataObjectToString(customDataObj)
{
    var string = "";
    
    if(customDataObj)
    {
        var keyArray = [];
        
        for(var k in customDataObj)
        {
            keyArray.push(k);
        }
        
        for(var i = 0; i<keyArray.length; ++i )
        {
            string += k + "=" + customDataObj[k];
            if(i < keyArray.length - 1)
            {
                string += ";";
            }
        }
    }
    
    return string;
}

//------------------------------------------------------------------------------------------------

function getQuestDifficulty( questPathId, questId )
{
    var metaCollectionAchievements = Spark.metaCollection( "achievements" );
    
    var difcSum = 0;
    var achIdList = getAchievementIds( questPathId, questId );
    for(var i = 0; i<achIdList.length; ++i)
    {
        var metaAch = metaCollectionAchievements.findOne( { "_id" : achIdList[i] } );
        if(metaAch)
        {
            difcSum += metaAch.difficulty;
        }
    }
    
    return difcSum;
}

//------------------------------------------------------------------------------------------------

function getAllUsedGsAchievementShortCodes()
{
    var result = mergeArraysWithoutDuplicates( getAllQuestPathIds(), getAllQuestIds() );
    result = mergeArraysWithoutDuplicates( result, getAllAchievementIds() );
    
    return result;
}

function getAllUnusedGsAchievementShortCodes()
{
    var usedGsAchShortCodeList = getAllUsedGsAchievementShortCodes();
    var allGsAchList = Spark.getConfig().getAchievements();
    var allGsAchShortCodeList = [];
    for(var i = 0; i<allGsAchList.length; ++i)
    {
        allGsAchShortCodeList.push(allGsAchList[i].shortCode);
    }
    
    var result = removeFromArray( allGsAchShortCodeList, usedGsAchShortCodeList );
    return result;
}

//------------------------------------------------------------------------------------------------

// returns all used questPathId
function getAllQuestPathIds()
{
    var qpidList = [];
    
    var metaCursorQp = Spark.metaCollection("questPaths").find().sort( { "_id" : 1 } );
    while(metaCursorQp.hasNext())
    {
        var metaQp = metaCursorQp.next();
        addUniqueValueToArray( qpidList, metaQp._id );
    }
    
    return qpidList
}

//------------------------------------------------------------------------------------------------

// returns all questId in questPathId
function getQuestIds( questPathId )
{
    var qidList = [];
    
    var metaQp = Spark.metaCollection("questPaths").findOne( { "_id" : questPathId } );
    
    if(metaQp)
    {
        if(metaQp.quests)
        {
            for(var i = 0; i<metaQp.quests.length; ++i)
            {
                addUniqueValueToArray( qidList, metaQp.quests[i]._id );
            }
        }
    }
    
    return qidList;
}

// returns all used questId-s
function getAllQuestIds()
{
    var allQidList = [];
    
    var qpidList = getAllQuestPathIds();
    for(var i = 0; i<qpidList.length; ++i)
    {
        var qidList = getQuestIds( qpidList[i] );
        allQidList = mergeArraysWithoutDuplicates( allQidList, qidList );
    }

    return allQidList;
}

// returns all GS achievements used as questId-s
function getQuests( questPathId )
{
    var qList = [];
    
    var qidList = getQuestIds( questPathId );
    
    if(qidList)
    {
        var config = Spark.getConfig();
        for(var i = 0; i<qidList.length; ++i)
        {
            var gsAchievement = config.getAchievement( qidList[i] );
            if(gsAchievement)
            {
                qList.push( gsAchievement );
            }
        }
    }
    
    return qList;
}

//------------------------------------------------------------------------------------------------

// returns all achId-s in questPathId, questId
function getAchievementIds( questPathId, questId )
{
    var achIdList = [];
    
    var metaQp = Spark.metaCollection("questPaths").findOne( { "_id" : questPathId } );
    
    if(metaQp && metaQp.quests)
    {
        for(var i = 0; i<metaQp.quests.length; ++i)
        {
            if(metaQp.quests[i]._id === questId)
            {
                if(metaQp.quests[i].achievements)
                {
                    for(var j = 0; j<metaQp.quests[i].achievements.length; ++j)
                    {
                        addUniqueValueToArray( achIdList, metaQp.quests[i].achievements[j]._id );
                    }
                }
                
                break;
            }
        }
    }
    
    return achIdList;
}

// returns all used achievementId-s
function getAllAchievementIds()
{
    var allAchIdList = [];
    
    var qpidList = getAllQuestPathIds();
    for(var i = 0; i<qpidList.length; ++i)
    {
        var qidList = getQuestIds( qpidList[i] );
        for(var j = 0; j<qidList.length; ++j)
        {
            var achIdList = getAchievementIds( qpidList[i], qidList[j] );
            allAchIdList = mergeArraysWithoutDuplicates( allAchIdList, achIdList );
        }
    }
    
    return allAchIdList;
}

// returns all GS achievements used as achievementId-s
function getAchievements( questPathId, questId )
{
    var achList = [];
    
    var achIdList = getAchievementIds( questPathId, questId );
    
    if(achIdList)
    {
        var config = Spark.getConfig();
        for(var i = 0; i<achIdList.length; ++i)
        {
            var gsAchievement = config.getAchievement( achIdList[i] );
            if(gsAchievement)
            {
                achList.push( gsAchievement );
            }
        }
    }
    
    return achList;
}

//------------------------------------------------------------------------------------------------

// return true if success
function deleteQuestPathRecordById( questPathId )
{
    var result = Spark.runtimeCollection("questPaths").findAndRemove( { "_id" : questPathId } );
    
    return result !== null;
}

// return true if success
function deleteQuestRecordById( questPathId, questId )
{
    var metaCollectionQuestPaths = Spark.metaCollection("questPaths");
    var metaQp = metaCollectionQuestPaths.findOne( { "_id" : questPathId } );

    if( metaQp && metaQp.quests && findIndexByKeyValue( metaQp.quests, "_id", questId ) >= 0 )
    {
        metaCollectionQuestPaths.update( { "_id" : questPathId }, { $pull: { quests : { "_id" : questId } } } );
        return true;
    }
    
    return false;
}

// return true if success
function deleteAchievementRecordById( questPathId, questId, achievementId )
{
    var metaCollectionQuestPaths = Spark.metaCollection("questPaths");
    
    var metaQp = metaCollectionQuestPaths.findOne( { "_id" : questPathId } );
    
    if( metaQp && metaQp.quests )
    {
        var qIndex = findIndexByKeyValue( metaQp.quests, "_id", questId );
        if( qIndex >= 0)
        {
            if(metaQp.quests[qIndex].achievements)
            {
                var achIndex = findIndexByKeyValue( metaQp.quests[qIndex].achievements, "_id", achievementId );
                if(achIndex >= 0)
                {
                    metaQp.quests[qIndex].achievements.splice(achIndex, 1);

                    metaCollectionQuestPaths.update( { "_id" : questPathId }, { $set: { "quests" : metaQp.quests } } );
                    return true;
                }
            }
        }
    }

    return false;
}

//------------------------------------------------------------------------------------------------

// return true if success
function addQuestPathRecord( questPathId )
{
    var metaCollectionQuestPaths = Spark.metaCollection("questPaths");
 
    var newMetaQp = {
        "_id" : questPathId,
        "quests" : []
    };
    
    try
    {
        return metaCollectionQuestPaths.insert(newMetaQp);
    }
    catch(ex)
    {
        return false;
    }
}

// return true if success
function addQuestRecord( questPathId, questId )
{
    var metaCollectionQuestPaths = Spark.metaCollection("questPaths");
    var metaQp = metaCollectionQuestPaths.findOne( { "_id" : questPathId } );

    if( metaQp && metaQp.quests && metaQp.quests.indexOf( questId ) < 0 )
    {
        var newMetaQ = {
            "_id" : questId,
            "achievements" : []
        };
        
        metaCollectionQuestPaths.update( { "_id" : questPathId }, { $push: { quests : newMetaQ } } );
        
        return true;
    }
    
    return false;
}

// return true if success
function addAchievementRecord( questPathId, questId, achievementId )
{
    var metaCollectionQuestPaths = Spark.metaCollection("questPaths");
    
    var metaQp = metaCollectionQuestPaths.findOne( { "_id" : questPathId } );
    
    if( metaQp && metaQp.quests )
    {
        var qIndex = findIndexByKeyValue( metaQp.quests, "_id", questId );
        if( qIndex >= 0)
        {
            if(metaQp.quests[qIndex].achievements)
            {
                var achIndex = findIndexByKeyValue( metaQp.quests[qIndex].achievements, "_id", achievementId );
                if(achIndex < 0)
                {
                    var newMetaAch = {
                        "_id" : achievementId
                    };
                    
                    metaQp.quests[qIndex].achievements.push(newMetaAch);

                    metaCollectionQuestPaths.update( { "_id" : questPathId }, { $set: { "quests" : metaQp.quests } } );
                    return true;
                }
            }
        }
    }

    return false;
}

//------------------------------------------------------------------------------------------------

// direction is "up" or "down"
// return true if success
function moveQuestRecord( questPathId, questId, direction )
{
    var metaCollectionQuestPaths = Spark.metaCollection("questPaths");
    var metaQp = metaCollectionQuestPaths.findOne( { "_id" : questPathId } );

    if( metaQp && metaQp.quests )
    {
        var qIndex = findIndexByKeyValue( metaQp.quests, "_id", questId );
        if( qIndex >= 0 )
        {
            if( direction === "up" && qIndex > 0 )
            {
                var tempQ = metaQp.quests[qIndex-1];
                metaQp.quests[qIndex-1] = metaQp.quests[qIndex];
                metaQp.quests[qIndex] = tempQ;
                
                metaCollectionQuestPaths.update( { "_id" : questPathId }, { $set: { "quests" : metaQp.quests } } );
                return true;
            }
            
            if( direction === "down" && qIndex + 1 < metaQp.quests.length )
            {
                var tempQ = metaQp.quests[qIndex+1];
                metaQp.quests[qIndex+1] = metaQp.quests[qIndex];
                metaQp.quests[qIndex] = tempQ;
                
                metaCollectionQuestPaths.update( { "_id" : questPathId }, { $set: { "quests" : metaQp.quests } } );
                return true;
            }
        }
    }

    return false;
}

// direction is "up" or "down"
// return true if success
function moveAchievementRecord( questPathId, questId, achievementId, direction )
{
    var metaCollectionQuestPaths = Spark.metaCollection("questPaths");
    
    var metaQp = metaCollectionQuestPaths.findOne( { "_id" : questPathId } );
    
    if( metaQp && metaQp.quests )
    {
        var qIndex = findIndexByKeyValue( metaQp.quests, "_id", questId );
        if( qIndex >= 0)
        {
            var metaQ = metaQp.quests[qIndex];
            if(metaQ.achievements)
            {
                var achIndex = findIndexByKeyValue( metaQ.achievements, "_id", achievementId );
                if(achIndex >= 0)
                {
                    if( direction === "up" && achIndex > 0 )
                    {
                        var tempAch = metaQ.achievements[achIndex-1];
                        metaQ.achievements[achIndex-1] = metaQ.achievements[achIndex];
                        metaQ.achievements[achIndex] = tempAch;
                        
                        metaCollectionQuestPaths.update( { "_id" : questPathId }, { $set: { "quests" : metaQp.quests } } );
                        return true;
                    }
                    
                    if( direction === "down" && achIndex + 1 < metaQ.achievements.length )
                    {
                        var tempAch = metaQ.achievements[achIndex+1];
                        metaQ.achievements[achIndex+1] = metaQ.achievements[achIndex];
                        metaQ.achievements[achIndex] = tempAch;
                       
                        metaCollectionQuestPaths.update( { "_id" : questPathId }, { $set: { "quests" : metaQp.quests } } );
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

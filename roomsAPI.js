function rooms(parameters,requestType){
  console.log("tmpData being passed: ", parameters.tmpData);
  console.log("parameters.url: ", parameters.url);
  if (parameters.url == null || parameters.url == undefined){
      parameters.url = "https://api.ciscospark.com/v1/rooms"
      console.log("setting parameters.url: ", parameters.url);
    } 

  if (requestType == "listRooms"){
      method = "GET";
      if (parameters.max != null && parameters.max !=0){
      parameters.url = parameters.url+"?max="+parameters.max;
    }
  }
  if (requestType == "getRoomDetails"){
    method = "GET";
    parameters.url = parameters.url+"/"+parameters.roomId;
  }
  if (requestType == "createARoom"){
    method = "POST";
    data = JSON.stringify({title: parameters.title});
  }
  if (requestType == "deleteARoom"){
    method = "DELETE";
    parameters.url = parameters.url+"/"+parameters.roomId;
  }
  if (requestType == "updateARoom"){
    method = "PUT";
    parameters.url = parameters.url+"/"+parameters.roomId;
    data = JSON.stringify({title: parameters.title});
  }


  console.log("parameters.url: ", parameters.url);
  if (method == "GET" || method == "DELETE"){
    var settings = {
        "async": true,
        "cache": false,
        "crossDomain": true,
        "url": parameters.url,
        "method": method,
        "headers": {
          "content-type": "application/json",
          "authorization": sparkToken
          }

    }//var settings = 
  }//if (method == "GET")

  if (method =="POST" || method == "PUT"){
    var settings = {
        "async": true,
        "cache": false,
        "crossDomain": true,
        "url": parameters.url,
        "method": method,
        "headers": {
          "content-type": "application/json",
          "authorization": sparkToken
          },
        "data": data
    }////var settings = 

  }//if (method =="POST")
  return $.ajax(settings).done(function (response, status,xhr) {
    //console.log("received rooms list", response.items);
    console.log("status code:", status);
    console.log("xhr: ", xhr);
  });
}

function requestMoreRooms(parameters,requestType){  
  if (parameters.tmpData == undefined){
      parameters.tmpData = [];
    console.log("initializing tmpData!!!");
  }//if (tmpData==undefined){
  console.log("max passed:", parameters.max);
  console.log("tmpData being passed: ", parameters.tmpData);

  return rooms(parameters,requestType).then(function(response, status,xhr){
    var nextlink = xhr.getResponseHeader('Link');
    console.log("status code received:", status);
    console.log("response: ",response);
    console.log("xhr: ", xhr);
    console.log("nextlink:",nextlink);
    parameters.tmpData.push(response.items);
    parameters.tmpData = _.flatten(parameters.tmpData);
    console.log("latest tmpData: ", parameters.tmpData);
    console.log("tmpData.length: ",parameters.tmpData.length);
    if (nextlink == null || parameters.tmpData.length == parameters.max){
        console.log("I should be done");
        var dataSet = {
          "results": parameters.tmpData,
          "xhr": xhr
        }
        return dataSet;
      }//if (nextlink == null || tmpData.length == max)
    if (parameters.max==undefined){
        if (nextlink != null){
            console.log("max undefined: I have more rooms to get");
            var myRegexp = /(http.+)(>)/g;
            console.log("myRegexp", myRegexp);
            var match = myRegexp.exec(nextlink);
            console.log("match: ", match);
            parameters.url = match[1];
            return requestMoreRooms(parameters,requestType);
          }//if (nextlink != null)
        }//if (max==undefined){
    if (parameters.max>0){
        if (nextlink != null && parameters.tmpData.length <parameters.max){
            console.log("max defined: I have more rooms to get");
            var myRegexp = /(http.+)(>)/g;
            console.log("myRegexp", myRegexp);
            var match = myRegexp.exec(nextlink);
            console.log("match: ", match);
            parameters.url = match[1];
            return requestMoreRooms(parameters,requestType);
          }//if (nextlink != null && tmpData.length <max)
        }//if (max>0){          
  });//rooms(parameters,requestType).then(function(response, status,xhr)
}

function requestRoomDetails(parameters,requestType){  
  return rooms(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestCreateARoom(parameters,requestType){  
  return rooms(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestDeleteARoom(parameters,requestType){  
  return rooms(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestUpdateARoom(parameters,requestType){  
  return rooms(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}


function gotAllDataRooms(parameters,requestType){
  if (requestType == "listRooms"){
    return requestMoreRooms(parameters,requestType);
  }
  if (requestType == "getRoomDetails"){
    return requestRoomDetails(parameters,requestType);
  }
  if (requestType == "createARoom"){
    return requestCreateARoom(parameters,requestType);
  }
  if (requestType == "deleteARoom"){
    return requestDeleteARoom(parameters,requestType);
  }
  if (requestType == "updateARoom"){
    return requestUpdateARoom(parameters,requestType);
  }
}

function listRooms(max){
  var parameters = {
          "max": max
        }
  var requestType = "listRooms";
  gotAllDataRooms(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
        return failInfo;
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
        return resultsData;
      });
}

function getRoomDetails(roomId){
  var parameters = {
    "roomId": roomId,
      }

  var requestType = "getRoomDetails";
  gotAllDataRooms(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function createARoom(title){
  var parameters = {
    "title": title
  }
  var requestType = "createARoom";
  gotAllDataRooms(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function updateARoom(roomId,title){
  var parameters = {
    "roomId": roomId,
    "title": title
  }
  var requestType = "updateARoom";
  gotAllDataRooms(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })  
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function deleteARoom(roomId){
  var parameters = {
    "roomId": roomId
  }
  var requestType = "deleteARoom";
  gotAllDataRooms(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })  
    .done(function(resultsData){
        console.log("Your room has been deleted");
      });
}


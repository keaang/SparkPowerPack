function messages(parameters,requestType){
  console.log("tmpData being passed: ", parameters.tmpData);
  console.log("parameters.url: ", parameters.url);
  if (parameters.url == null || parameters.url == undefined){
      parameters.url = "https://api.ciscospark.com/v1/messages"
      console.log("setting parameters.url: ", parameters.url);
    } 

  if (requestType == "listMessages"){
      method = "GET";
      parameters.url = parameters.url+"?";
      
      if (parameters.roomId != undefined && parameters.roomId != "" && parameters.roomId != null){
        parameters.url = parameters.url+"&roomId="+parameters.roomId;
      }
      if (parameters.before != undefined && parameters.before != "" && parameters.before != null){
        parameters.url = parameters.url+"&before="+parameters.before;
      }
      if (parameters.beforeMessage != undefined && parameters.beforeMessage != "" && parameters.beforeMessage != null){
        parameters.url = parameters.url+"&beforeMessage="+parameters.beforeMessage;
      }      
      if (parameters.max != undefined && parameters.max != "" && parameters.max != null){
        parameters.url = parameters.url+"&max="+parameters.max;
      }      
  }//if (requestType == "listMessages")

  if (requestType == "createAMessage"){
      method = "POST";
      
      //set isModerator to false by default if not set to true
      if (parameters.isModerator != true){
        parameters.isModerator = false;
      }

      //use this data in the body if roomId is defined    
      if (parameters.roomId != "" && parameters.roomId != null && parameters.roomId != undefined){
          console.log("I'm using the roomId");
          data = {
            roomId  : parameters.roomId,
            text    : parameters.text
          }
      }
      //use this data in the body if toPersonId is defined
      if (parameters.toPersonId != "" && parameters.toPersonId != null && parameters.toPersonId != undefined){
          console.log("I'm using the personId");
          
          data = {
            toPersonId  : parameters.toPersonId,
            text      : parameters.text
          }
          console.log("data being used: ",data);

      }

      //use this data in the body if toPersonEmail is defined
      if (parameters.toPersonEmail != "" && parameters.toPersonEmail != null && parameters.toPersonEmail != undefined){
          console.log("I'm using the toPersonEmail");

          data = {
            toPersonEmail  : parameters.toPersonEmail,
            text           : parameters.text
          } 
      }
    
    //add in file to the data ody if it is defined
    if (parameters.files != "" && parameters.files != null && parameters.files != undefined){
          data.files = parameters.files.split(",");
    }        
    
    data = JSON.stringify(data);
    console.log("final data being used: ",data);
  }//if (requestType == "createAMessage")

  if (requestType == "getMessageDetails"){
    method = "GET";
    parameters.url = parameters.url+"/"+parameters.messageId;

  }

  if (requestType == "deleteAMessage"){
    method = "DELETE";
    parameters.url = parameters.url+"/"+parameters.messageId;
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

  if (method == "POST" || method == "PUT"){
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

function requestListMessages(parameters,requestType){  
  if (parameters.tmpData == undefined){
      parameters.tmpData = [];
    console.log("initializing tmpData!!!");
  }//if (tmpData==undefined){
  console.log("max passed:", parameters.max);
  console.log("tmpData being passed: ", parameters.tmpData);

  return messages(parameters,requestType).then(function(response, status,xhr){
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
            return requestListMessages(parameters,requestType);
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
            return requestListMessages(parameters,requestType);
          }//if (nextlink != null && tmpData.length <max)
        }//if (max>0){          
  });//rooms(parameters,requestType).then(function(response, status,xhr)
}

function requestCreateAMessage(parameters,requestType){  
  return messages(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestGetMessageDetails(parameters,requestType){  
  return messages(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestDeleteAMessage(parameters,requestType){  
  return messages(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}


function gotAllDataMessages(parameters,requestType){
  if (requestType == "listMessages"){
    return requestListMessages(parameters,requestType);
  }
  if (requestType == "createAMessage"){
    return requestCreateAMessage(parameters,requestType);
  }
  if (requestType == "getMessageDetails"){
    return requestGetMessageDetails(parameters,requestType);
  }
  if (requestType == "deleteAMessage"){
    return requestDeleteAMessage(parameters,requestType);
  }

}

function listMessages(roomId, before, beforeMessage, max){
  var parameters = {
    "roomId"        : roomId,
    "before"        : before, 
    "beforeMessage" : beforeMessage,
    "max"           : max
  }
  var requestType = "listMessages";
  gotAllDataMessages(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function createAMessage(roomId, text, files, toPersonId, toPersonEmail){
  var parameters = {
    "roomId"        : roomId,
    "text"          : text, 
    "files"         : files,
    "toPersonId"    : toPersonId,
    "toPersonEmail" : toPersonEmail
  }

  var requestType = "createAMessage";
  gotAllDataMessages(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })  
    .done(function(resultsData){
        console.log("Message sent:", resultsData);
      });
}


function getMessageDetails(messageId){
  var parameters = {
    "messageId": messageId,
      }

  var requestType = "getMessageDetails";
  gotAllDataMessages(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function deleteAMessage(messageId){
  var parameters = {
    "messageId"  : messageId,
  }

  var requestType = "deleteAMessage";
  gotAllDataMessages(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}


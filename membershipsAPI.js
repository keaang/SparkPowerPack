function memberships(parameters,requestType){
  console.log("tmpData being passed: ", parameters.tmpData);
  console.log("parameters.url: ", parameters.url);
  if (parameters.url == null || parameters.url == undefined){
      parameters.url = "https://api.ciscospark.com/v1/memberships"
      console.log("setting parameters.url: ", parameters.url);
    } 

  if (requestType == "listMemberships"){
      method = "GET";
      parameters.url = parameters.url+"?";

      if (parameters.roomId != undefined && parameters.roomId != "" && parameters.roomId != null){
        parameters.url = parameters.url+"&roomId="+parameters.roomId;
      }
      if (parameters.personId != undefined && parameters.personId != "" && parameters.personId != null){
        parameters.url = parameters.url+"&personId="+parameters.personId;
      }
      if (parameters.personEmail != undefined && parameters.personEmail != "" && parameters.personEmail != null){
        parameters.url = parameters.url+"&personEmail="+parameters.personEmail;
      }      
      if (parameters.max != undefined && parameters.max != "" && parameters.max != null){
        parameters.url = parameters.url+"&max="+parameters.max;
      }      

  }
  if (requestType == "createAMembership"){
    method = "POST";
    
    //set isModerator to false by default if not set to true
    if (parameters.isModerator != true){
      parameters.isModerator = false;
    }
    //use this data in the body if personEmail is defined
    if (parameters.personEmail != "" && parameters.personEmail !=null && parameters.personEmail != undefined){
        data = JSON.stringify({
          roomId      : parameters.roomId,
          personEmail : parameters.personEmail,
          isModerator : parameters.isModerator
        })
    }
    //use this data in the body if personId is defined
    if (parameters.personId != "" && parameters.personId !=null && parameters.personId != undefined){
        data = JSON.stringify({
          roomId      : parameters.roomId,
          personId    : parameters.personId,
          isModerator : parameters.isModerator
        })
    }
    console.log("data being used: ",data)
  }

  if (requestType == "getMembershipDetails"){
    method = "GET";
    parameters.url = parameters.url+"/"+parameters.membershipId;

  }

  if (requestType == "updateAMembership"){
    method = "PUT";
    parameters.url = parameters.url+"/"+parameters.membershipId;
    data = JSON.stringify({isModerator: parameters.isModerator}); 
  }

  if (requestType == "deleteAMembership"){
    method = "DELETE";
    parameters.url = parameters.url+"/"+parameters.membershipId;
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

function requestListMemberships(parameters,requestType){  
  if (parameters.tmpData == undefined){
      parameters.tmpData = [];
    console.log("initializing tmpData!!!");
  }//if (tmpData==undefined){
  console.log("max passed:", parameters.max);
  console.log("tmpData being passed: ", parameters.tmpData);

  return memberships(parameters,requestType).then(function(response, status,xhr){
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
            return requestListMemberships(parameters,requestType);
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
            return requestListMemberships(parameters,requestType);
          }//if (nextlink != null && tmpData.length <max)
        }//if (max>0){          
  });//rooms(parameters,requestType).then(function(response, status,xhr)
}

function requestCreateAMembership(parameters,requestType){  
  return memberships(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestGetMembershipDetails(parameters,requestType){  
  return memberships(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestUpdateAMembership(parameters,requestType){  
  return memberships(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestDeleteAMembership(parameters,requestType){  
  return memberships(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}



function gotAllDataMemberships(parameters,requestType){
  if (requestType == "listMemberships"){
    return requestListMemberships(parameters,requestType);
  }
  if (requestType == "createAMembership"){
    return requestCreateAMembership(parameters,requestType);
  }
  if (requestType == "getMembershipDetails"){
    return requestGetMembershipDetails(parameters,requestType);
  }
  if (requestType == "updateAMembership"){
    return requestUpdateAMembership(parameters,requestType);
  }
  if (requestType == "deleteAMembership"){
    return requestDeleteAMembership(parameters,requestType);
  }

}

function listMemberships(roomId, personId, personEmail, max){
  var parameters = {
    "roomId"      : roomId,
    "personId"    : personId, 
    "personEmail" : personEmail,
    "max"         : max
  }
  var requestType = "listMemberships";
  gotAllDataMemberships(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}


function createAMembership(roomId, personId, personEmail, isModerator){
  var parameters = {
    "roomId"      : roomId,
    "personId"    : personId, 
    "personEmail" : personEmail,
    "isModerator" : isModerator
  }

  var requestType = "createAMembership";
  gotAllDataMemberships(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })  
    .done(function(resultsData){
        console.log("Member added to room");
      });
}


function getMembershipDetails(membershipId){
  var parameters = {
    "membershipId": membershipId,
      }

  var requestType = "getMembershipDetails";
  gotAllDataMemberships(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function updateAMembership(membershipId, isModerator){
  var parameters = {
    "membershipId"  : membershipId,
    "isModerator"   : isModerator 
  }
  var requestType = "updateAMembership";
  gotAllDataMemberships(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function deleteAMembership(membershipId){
  var parameters = {
    "membershipId": membershipId
  }

  var requestType = "deleteAMembership";
  gotAllDataMemberships(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })  
    .done(function(resultsData){
        console.log("MembershipId deleted:", resultsData);
      });
}


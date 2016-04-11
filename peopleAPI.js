function people(parameters,requestType){
  console.log("tmpData being passed: ", parameters.tmpData);
  console.log("parameters.url: ", parameters.url);
  if (parameters.url == null || parameters.url == undefined){
      parameters.url = "https://api.ciscospark.com/v1/people"
      console.log("setting parameters.url: ", parameters.url);
    } 

  if (requestType == "listPeople"){
    method = "GET";
    console.log("parameters:",parameters);
    parameters.url =parameters.url+"?"
    if (parameters.email != undefined && parameters.email != "" && parameters.email != null){
      parameters.url = parameters.url+"&email="+parameters.email;
      }
    if (parameters.displayName != undefined && parameters.displayName != "" && parameters.displayName != null){
      parameters.url = parameters.url+"&displayName="+parameters.displayName;
      }
    if (parameters.max != undefined && parameters.max != "" && parameters.max != null){
      parameters.url = parameters.url+"&max="+parameters.max;
      }
  }
  if (requestType == "getPersonDetails"){
    method = "GET";
    parameters.url = parameters.url+"/"+parameters.personId;
  }
  if (requestType == "getPersonDetailsMe"){
    method = "GET";
    parameters.url = parameters.url+"/"+"me";
  }


  console.log("parameters.url: ", parameters.url);
  if (method == "GET"){
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

  return $.ajax(settings).done(function (response, status,xhr) {
    console.log("status code:", status);
    console.log("xhr: ", xhr);
  });
}

function requestListPeople(parameters,requestType){  
  if (parameters.tmpData == undefined){
      parameters.tmpData = [];
    console.log("initializing tmpData!!!");
  }//if (tmpData==undefined){
  console.log("max passed:", parameters.max);
  console.log("tmpData being passed: ", parameters.tmpData);

  return people(parameters,requestType).then(function(response, status,xhr){
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
            console.log("max undefined: I have more people to get");
            var myRegexp = /(http.+)(>)/g;
            console.log("myRegexp", myRegexp);
            var match = myRegexp.exec(nextlink);
            console.log("match: ", match);
            parameters.url = match[1];
            return requestListPeople(parameters,requestType);
          }//if (nextlink != null)
        }//if (max==undefined){
    if (parameters.max>0){
        if (nextlink != null && parameters.tmpData.length <parameters.max){
            console.log("max defined: I have more people to get");
            var myRegexp = /(http.+)(>)/g;
            console.log("myRegexp", myRegexp);
            var match = myRegexp.exec(nextlink);
            console.log("match: ", match);
            parameters.url = match[1];
            return requestListPeople(parameters,requestType);
          }//if (nextlink != null && tmpData.length <max)
        }//if (max>0){
               
  });//rooms(parameters,requestType).then(function(response, status,xhr)
}


function requestGetPersonDetails(parameters,requestType){  
  return people(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestGetPersonDetailsMe(parameters,requestType){  
  return people(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}


function gotAllDataPeople(parameters,requestType){

  if (requestType == "listPeople"){
    return requestListPeople(parameters,requestType);
  }
  if (requestType == "getPersonDetails"){
    return requestGetPersonDetails(parameters,requestType);
  }
  if (requestType == "getPersonDetailsMe"){
    return requestGetPersonDetailsMe(parameters,requestType);
  }

}

function listPeople(email, displayName, max){
  var parameters = {
          "email"       : email,
          "displayName" : displayName, 
          "max"         : max
        }
  var requestType = "listPeople";
  gotAllDataPeople(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function getPersonDetails(personId){
  var parameters = {
    "personId": personId
  }
  var requestType = "getPersonDetails";
  gotAllDataPeople(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}

function getPersonDetailsMe(roomId){
  var parameters = {

  }
  var requestType = "getPersonDetailsMe";
  gotAllDataPeople(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })  
    .done(function(resultsData){
        console.log("ALl of your data:", resultsData);
      });
}


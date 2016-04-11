function webhooks(parameters,requestType){
  console.log("tmpData being passed: ", parameters.tmpData);
  console.log("parameters.url: ", parameters.url);
  if (parameters.url == null || parameters.url == undefined){
      parameters.url = "https://api.ciscospark.com/v1/webhooks"
      console.log("setting parameters.url: ", parameters.url);
    } 

  if (requestType == "listWebhooks"){
      method = "GET";
      parameters.url = parameters.url+"?";
         
      if (parameters.max != undefined && parameters.max != "" && parameters.max != null){
        parameters.url = parameters.url+"max="+parameters.max;
      }      
  }

  if (requestType == "createAWebhook"){
      method = "POST";

      data = {
        name      : parameters.name,
        targetUrl : parameters.targetUrl,
        resource  : parameters.resource,
        event     : parameters.event,
        filter    : parameters.filter
      }
  }//if (requestType == "createAWebhook")

  if (requestType == "getWebhookDetails"){
    method = "GET";
    parameters.url = parameters.url+"/"+parameters.webhookId;

  }

  if (requestType == "updateAWebhook"){
    method = "PUT";
    parameters.url = parameters.url+"/"+parameters.webhookId;
    data = {
      name      : parameters.name,
      targetUrl : parameters.targetUrl
    } 
  }


  if (requestType == "deleteAWebhook"){
    method = "DELETE";
    parameters.url = parameters.url+"/"+parameters.webhookId;
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
    data = JSON.stringify(data);
    console.log("final data being used: ",data);
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

function requestListWebhooks(parameters,requestType){  
  if (parameters.tmpData == undefined){
      parameters.tmpData = [];
    console.log("initializing tmpData!!!");
  }//if (tmpData==undefined){
  console.log("max passed:", parameters.max);
  console.log("tmpData being passed: ", parameters.tmpData);

  return webhooks(parameters,requestType).then(function(response, status,xhr){
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
            return requestListWebhooks(parameters,requestType);
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
            return requestListWebhooks(parameters,requestType);
          }//if (nextlink != null && tmpData.length <max)
        }//if (max>0){          
  });//rooms(parameters,requestType).then(function(response, status,xhr)
}

function requestCreateAWebhook(parameters,requestType){  
  return webhooks(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestGetWebhookDetails(parameters,requestType){  
  return webhooks(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestUpdateAWebhook(parameters,requestType){  
  return webhooks(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}

function requestDeleteAWebhook(parameters,requestType){  
  return webhooks(parameters,requestType).then(function(response, status,xhr){
        var dataSet = {
          "results": response,
          "xhr": xhr
        }
        return dataSet;
  });//rooms(parameters,requestType).then(function(response, status,xhr)  
}


function gotAllDataMessages(parameters,requestType){
  if (requestType == "listWebhooks"){
    return requestListWebhooks(parameters,requestType);
  }
  if (requestType == "createAWebhook"){
    return requestCreateAWebhook(parameters,requestType);
  }
  if (requestType == "getWebhookDetails"){
    return requestGetWebhookDetails(parameters,requestType);
  }
  if (requestType == "updateAWebhook"){
    return requestUpdateAWebhook(parameters,requestType);
  }  
  if (requestType == "deleteAWebhook"){
    return requestDeleteAWebhook(parameters,requestType);
  }

}

function listWebhooks(max){
  var parameters = {
    "max" : max
  }

  var requestType = "listWebhooks";
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

function createAWebhook(name, targetUrl, resource, event, filter){
  var parameters = {
    "name"      : name,
    "targetUrl" : targetUrl, 
    "resource"  : resource,
    "event"     : event,
    "filter"    : filter
  }

  var requestType = "createAWebhook";
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


function getWebhookDetails(webhookId){
  var parameters = {
    "webhookId": webhookId,
      }

  var requestType = "getWebhookDetails";
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

function updateAWebhook(webhookId, name, targetUrl){
  var parameters = {
    "webhookId" : webhookId,
    "name"      : name,
    "targetUrl" : targetUrl 
      }

  var requestType = "updateAWebhook";
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

function deleteAWebhook(webhookId){
  var parameters = {
    "webhookId"  : webhookId,
  }

  var requestType = "deleteAWebhook";
  gotAllDataMessages(parameters,requestType)
    .fail(function (failInfo){
        console.log("returned exception error: ", failInfo);
        console.log("returned status code: ",failInfo.status);
        console.log("returned statusText: ",failInfo.statusText);
      })
    .done(function(resultsData){
        console.log("Webhook deleted");
      });
}
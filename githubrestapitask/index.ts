import tl = require('azure-pipelines-task-lib/task');
import {Utility} from "./Utility";
import httpClient = require("typed-rest-client/HttpClient");
import httpInterfaces = require("typed-rest-client/Interfaces");


let proxyUrl: string = tl.getVariable("agent.proxyurl");
var requestOptions: httpInterfaces.IRequestOptions = proxyUrl ? {
    proxy: {
        proxyUrl: proxyUrl,
        proxyUsername: tl.getVariable("agent.proxyusername"),
        proxyPassword: tl.getVariable("agent.proxypassword"),
        proxyBypassHosts: tl.getVariable("agent.proxybypasslist") ? JSON.parse(tl.getVariable("agent.proxybypasslist")) : null
    }
} : {};

let ignoreSslErrors: string = tl.getVariable("VSTS_ARM_REST_IGNORE_SSL_ERRORS");

if(ignoreSslErrors != null)
{
    requestOptions.ignoreSslError = ignoreSslErrors.toLowerCase() == "true";
}


var httpCallbackClient = new httpClient.HttpClient(tl.getVariable("AZURE_HTTP_USER_AGENT"), undefined, requestOptions);

async function run() {
    try {        
        // Get basic task inputs
        const githubEndpoint = tl.getInput("gitHubConnection", true);
        const githubEndpointToken = Utility.getGithubEndPointToken(githubEndpoint);
        
        const githuburl = tl.getInput("githubrestapiurl", true);
        const body = tl.getInput("body", false);
        const method = tl.getInput("method", true);
        
        let headers = {
            "Content-Type": "application/json",
            'Authorization': 'token ' + githubEndpointToken
        };
        
         console.log(method, githuburl);
         var response: httpClient.HttpClientResponse = await httpCallbackClient.request(method, githuburl, body, headers);
         console.log('Status Code', response.message.statusCode, 'Status Message',response.message.statusMessage);
         var resbody = await response.readBody();
         if (resbody) {
             console.log("Response: " + JSON.stringify(resbody));
         }
          
         let ignoreFailure: boolean = tl.getBoolInput("ignoreFailure");
         if( !ignoreFailure && response.message.statusCode != undefined && response.message.statusCode >= 300 )
         {
            tl.setResult(tl.TaskResult.Failed, "Github api call was unsuccessfull");
         }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
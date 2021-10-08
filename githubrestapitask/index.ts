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

/*
Path goes:
$.member.arrayMember.0.property
Or, if the root JSON value is expected to be an array:
$.0.member

Negative array indices are supported, Python style. Array length will be added to those.

The created job var name becomes whatever is after the initial "$.",
so for path "$.foo.bar" the var name will be "foo.bar".

If the variable value is an array or an object, we don't spell those out. Oh well.
*/
function extractValue(path : string, prefix : string, result : any) : void
{
    try
    {
        const pathParts = path.split(".");
        let context:any = null, contextName = "";
        for(const pathPart of pathParts)
        { //pathPart may be an member name or an array index
            let element:string|number = pathPart; //Member name or array index
            if(element == "$")
            {
                context = result;
                contextName = "";
            }
            else
            {
                if(!context)
                {
                    tl.warning("While evaluating " + path + ", the path " + contextName + " leads nowhere, can not resolve any further");
                    return;                    
                }

                if(Array.isArray(context))
                {
                    element = parseInt(element); //Member is an index!
                    if(isNaN(element))
                    {
                        tl.warning("While evaluating " + path + ", the member " + pathPart + " is not a valid array index");
                        return;                    
                    }
                    if(element < 0) //Allow for negative indices to extract the last element
                        element += context.length;                    
                }
                else if(!(element in context))
                {
                    tl.warning("While evaluating " + path + ", unable to resolve " + element + " under context " + contextName);
                    return;
                }

                context = context[element];
                if(contextName != "")
                    contextName += ".";
                contextName += pathPart;
            }
        }

        //Finally! Context is the path target now.
        const varName = prefix + contextName, value = context.toString();
        console.log("Value extracted: " + varName + "=" + value);
        tl.setVariable(varName, value);
    }
    catch(err: any)
    {
        tl.warning("While evaluating " + path + ", got at error: " + err.message);
    }
}

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
             var result = JSON.stringify(resbody);
             console.log("Response: " + result);
             tl.setVariable('Output', result);

             const valuesToExtract = tl.getInput("valuesToExtract");
             if(valuesToExtract)
             {
                const prefix = tl.getInput("valuePrefix"),
                    resObj = JSON.parse(resbody);
                for(const path of valuesToExtract.split("\n"))
                    if(path) //Allow for blank strings in the middle
                        extractValue(path.trim(), prefix ? prefix : "", resObj);
             }
         }
          
         let ignoreFailure: boolean = tl.getBoolInput("ignoreFailure");
         if( !ignoreFailure && response.message.statusCode != undefined && response.message.statusCode >= 300 )
         {
            tl.setResult(tl.TaskResult.Failed, "Github api call was unsuccessfull");
         }
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
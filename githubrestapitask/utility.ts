import tl = require("azure-pipelines-task-lib/task");
import path = require("path");
import fs = require('fs');

export class Utility {
    public static getGithubEndPointToken(githubEndpoint: string): string {
        const githubEndpointObject = tl.getEndpointAuthorization(githubEndpoint, false);
        let githubEndpointToken: string = "";

        if (!!githubEndpointObject) {
            tl.debug("Endpoint scheme: " + githubEndpointObject.scheme);
            
            if (githubEndpointObject.scheme === 'PersonalAccessToken') {
                githubEndpointToken = githubEndpointObject.parameters.accessToken
            } else if (githubEndpointObject.scheme === 'OAuth'){
                // scheme: 'OAuth'
                githubEndpointToken = githubEndpointObject.parameters.AccessToken
            } else if (githubEndpointObject.scheme === 'Token') {
                githubEndpointToken = githubEndpointObject.parameters.AccessToken;
            }
            else if (githubEndpointObject.scheme) {
                throw new Error(tl.loc("InvalidEndpointAuthScheme", githubEndpointObject.scheme));
            }
        }

        if (!githubEndpointToken) {
            throw new Error(tl.loc("InvalidGitHubEndpoint", githubEndpoint));
        }

        return githubEndpointToken;
    }
}

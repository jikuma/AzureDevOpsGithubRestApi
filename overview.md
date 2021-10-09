# GitHub AzureDevOps Rest Api Integration

Task "Azure DevOps GitHub Rest Api Integration" enables user to make rest api calls from the Azure devops pipeline. Using rest api you can change the status of commit, add comments to Pull request, tag a branch etc. GitHub has wide range of public rest api which you can use.

The task has a capability of publishing individual values from the response JSON
as Azure DevOps job variables.

![Sample Image](https://github.com/jikuma/AzureDevOpsGithubRestApi/blob/master/screenshots/screen1.PNG?raw=true)

# Examples
[Create an issue](https://github.com/jikuma/AzureDevOpsGithubRestApi/blob/master/issue.md)

[Sample pipeline to add a label for pull request](https://github.com/jikuma/AzureDevOpsGithubRestApi/blob/master/azure-pipelines-pr.yml)
 
[Sample to chain multiple github rest api call](https://github.com/jikuma/AzureDevOpsGithubRestApi/blob/master/azure-pipelines-pr.yml)

[Sample to retrieve the latest release' metadata](https://github.com/jikuma/AzureDevOpsGithubRestApi/blob/master/infoback.md)
# Create an issue in case of deployment failed

If you want to create an issue in case deployment failed, you need to provide the following inputs

|              Inputs              |      Values                  |
|----------------------------------|------------------------------|
| GitHub connection (OAuth or PAT) | Select a Github endpoint     |
| Method                           | Select Post                  |
| Body                             | <br>{<br>  "title": "Deployment to environment $(Release.EnvironmentName) failed",<br>  "body": "Release $(Release.DefinitionName) in environment  $(Release.EnvironmentName) failed.",<br>  "assignees": [<br>    "jikuma"<br>  ],<br>  "milestone": 1,<br>  "labels": [<br>    "Deployment"<br>  ]<br>}<br>|
|URL and parameters| https://api.github.com/repos/RepoName/issues  e.g: https://api.github.com/repos/jikuma/sampledevspacesapp/issues|

If you do not have milestone number, do not specify in Body json

![Release Definition](./screenshots/issue.PNG)
![GitHub](./screenshots/issuegithub.PNG)

# Retrieve the latest release' tag

If you want to retrieve a particular piece of data from
a JSON object that a GitHub REST API returns, you can use
the Extract Values and Prefix inputs. For example, to retrieve
the tag of the latest GitHub release, you need to provide the
following inputs:


|              Inputs              |      Values                  |
|----------------------------------|------------------------------|
| GitHub connection (OAuth or PAT) | Select a Github endpoint     |
| Method                           | Select GERT                  |
| Extract Values                   | $.tag_name                   |
| Variable Name Prefix             | RELEASE_
|URL and parameters| https://api.github.com/repos/RepoName/releases/latest  e.g: https://api.github.com/repos/jikuma/sampledevspacesapp/releasees/latest|

Once the task executes, there will be a variable in your job, called RELEASE_tag_name with the value that corresponds to the GitHub tag.

You can specify more than one line under Extract Values. Each line would
generate a job variable with the respective value.

The format of the value specification goes something like this:
`$.objectMember.arrayMember.0.property`. The dot notation is used both for
object field access and for array element access.

For arrays, negative indices are supported. If the index is negative,
the array length will be added to it, so -1 corresponds to the last element,
-2 to the penultimate and so on.

The name of the variable is generated from the prefix and the specification,
with the initial `$.` omitted. So the variable for the example above will be
called `PREFIXobjectMember.arrayMember.0.property`.

When Azure DevOps exposes job variables as Windows environment variables,
dots are replaced with underscores, and the whole name is capitalized. So
the variable above will be available to Windows command line tasks as `PREFIXOBJECTMEMBER_ARRAYMEMBER_0_PROPERTY`.
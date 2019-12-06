// TODO compile packages and this script to the big file
// https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-a-javascript-action

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

// Get the task_definition file contents
let taskDefinitionFilePath = core.getInput('task_definition_template_path');

const taskDefinitionFile = path.isAbsolute(taskDefinitionFilePath) ?
  taskDefinitionFilePath : path.join(process.env.GITHUB_WORKSPACE, taskDefinitionFilePath);

if ( !fs.existsSync(taskDefinitionFile) ) {
  throw new Error(`Task definition file does not exist: ${taskDefinitionFile}`);
}
const taskDefContents = require(taskDefinitionFile);

// Format env vars for task definition file
let envVarStringArray = core.getInput('secret_keys').split("\n");
envVarStringArray.splice(-1); // remove empty string element from the end

const secretKeys = envVarStringArray.map( (envVar) => {
  let splitEnvVar = envVar.split("=");

  if ( ['true', 'false'].includes(splitEnvVar[1]) ) {
    splitEnvVar[1] = splitEnvVar[1] == 'true';
  }

  return { "name": splitEnvVar[0], "value": splitEnvVar[1] };
})

// Replace 'environment' key in task_definition with parsed values from Vault
taskDefContents.containerDefinitions[0].environment = secretKeys;

// Output a new JSON response
core.setOutput('task_definition', JSON.stringify(taskDefContents));

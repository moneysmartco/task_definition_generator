const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

try {
  // Get the task_definition file contents
  let taskDefinitionFilePath = core.getInput('task_definition_template_path', { required: true });
  const containerName = core.getInput('container_name', { required: true });
  const family = core.getInput('family', { required: true });

  const taskDefinitionFile = path.isAbsolute(taskDefinitionFilePath) ?
    taskDefinitionFilePath : path.join(process.env.GITHUB_WORKSPACE, taskDefinitionFilePath);

  if ( !fs.existsSync(taskDefinitionFile) ) {
    throw new Error(`Task definition file does not exist: ${taskDefinitionFile}`);
  }
  const taskDefContents = require(taskDefinitionFile);

  // Format env vars for task definition file
  let envVarStringArray = core.getInput('secret_keys').split("\\n");
  core.debug(envVarStringArray)

  envVarStringArray.splice(-1); // remove empty string element from the end

  const secretKeys = envVarStringArray.map( (envVar) => {
    let splitEnvVar = envVar.split("=");
    return { "name": splitEnvVar[0].replace('"', ''), "value": splitEnvVar[1] };
  });

  // Replace 'family' key in task_definition with family set in github action
  taskDefContents.family = family;

  // Replace 'environment' key in task_definition with parsed values from Vault
  taskDefContents.containerDefinitions[0].environment = secretKeys;

  // replace 'name' key in task definition with name set in github action
  taskDefContents.containerDefinitions[0].name = containerName;

  // Output a new JSON response
  console.log(taskDefContents)
  core.setOutput('task_definition', JSON.stringify(taskDefContents));
} catch (error) {
  core.setFailed(error.message);
}

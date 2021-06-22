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

  core.debug(`secret_keys_json -  ${core.getInput('secret_keys_json')}`);

  let secretsObject = JSON.parse(core.getInput('secret_keys_json'))

  core.debug(`secretsObject -  ${secretsObject}`);

  const secretKeys = Object.keys(secretsObject).map (k => { return {"name": k, "value" : secretsObject[k]} } )

  core.debug(`secretKeys -  ${secretKeys}`);

  // Replace 'family' key in task_definition with family set in github action
  taskDefContents.family = family;

  // Replace 'environment' key in task_definition with parsed values from Vault
  taskDefContents.containerDefinitions[0].environment = secretKeys;

  // replace 'name' key in task definition with name set in github action
  taskDefContents.containerDefinitions[0].name = containerName;

  // Override cpu memory with vault values
  taskDefContents.containerDefinitions[0].cpu = secretsObject.cpu || taskDefContents.containerDefinitions[0].cpu
  taskDefContents.containerDefinitions[0].memory = secretsObject.cpu || taskDefContents.containerDefinitions[0].memory

  // Output a new JSON response
  console.log(taskDefContents)
  core.setOutput('task_definition', JSON.stringify(taskDefContents));
} catch (error) {
  core.setFailed(error.message);
}

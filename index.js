const core = require('@actions/core');

// 1. read the template json file
// 2. read the ENV
//    ENV_VAR_ONE=1
//    ENV_VAR_TWO=2
//    ENV_VAR_THREE=3
// 3. replace the `environment` attribute
//    {
//      "name": "ENV_VAR_ONE",
//      "value": 1
//    }
// 4. output a new JSON response

// This is how you return a value
// core.setOutput('task_definition', JSON.stringify(bla));


// This is how this person detected where the file is
//  const taskDefPath = path.isAbsolute(taskDefinitionFile) ?
//       taskDefinitionFile :
//       path.join(process.env.GITHUB_WORKSPACE, taskDefinitionFile);
//     if (!fs.existsSync(taskDefPath)) {
//       throw new Error(`Task definition file does not exist: ${taskDefinitionFile}`);
//     }
//     const taskDefContents = require(taskDefPath);
// https://github.com/aws-actions/amazon-ecs-render-task-definition/blob/master/index.js
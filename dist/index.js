module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(642);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 568:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 642:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(568);
const fs = __webpack_require__(747);
const path = __webpack_require__(622);

// Get the task_definition file contents
let taskDefinitionFilePath = core.getInput('task_definition_template_path', { required: true });
const containerName = core.getInput('container_name', { required: true });

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
});

// Replace 'environment' key in task_definition with parsed values from Vault
taskDefContents.containerDefinitions[0].environment = secretKeys;

// replace 'name' key in task definition with name set in github action
taskDefContents.containerDefinitions[0].name = containerName;

// Output a new JSON response
core.setOutput('task_definition', JSON.stringify(taskDefContents));


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ });
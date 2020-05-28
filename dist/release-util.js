#!/usr/bin/env node
"use strict";
exports.__esModule = true;
require("@madebyheyday/env-util");
var fs = require("fs");
var path = require("path");
var commander_1 = require("commander");
exports["default"] = commander_1.program;
var deploy_1 = require("./commands/deploy");
exports.deploy = deploy_1["default"];
var release_1 = require("./commands/release");
exports.release = release_1["default"];
var complete_deployment_1 = require("./commands/complete-deployment");
exports.completeDeployment = complete_deployment_1.completeDeployment;
var getPlugins_1 = require("./base/getPlugins");
var packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));
commander_1.program.version(packageJson.version, '-v, --version', 'output the current version');
commander_1.program
    .command('release')
    .option('-d, --dry-run', 'Perform a dry-run without creating a release')
    .description('Create a release in the current Git branch')
    .action(function (options) {
    release_1["default"](!!options.dryRun)["catch"](function (error) {
        console.error(error);
    });
});
commander_1.program
    .command('deploy')
    .description('Create a deployment by merging a release into a deployment branch')
    .action(function () {
    deploy_1["default"]()["catch"](function (error) {
        console.error(error);
    });
});
commander_1.program
    .command('complete-deployment')
    .description('Mark a deployment as completed')
    .action(function () {
    complete_deployment_1.completeDeployment()["catch"](function (error) {
        console.error(error);
    });
});
getPlugins_1["default"]().forEach(function (plugin) { return plugin.init(); });
commander_1.program.parse(process.argv);

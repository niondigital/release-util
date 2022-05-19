#!/usr/bin/env node
"use strict";
exports.__esModule = true;
exports["default"] = exports.finishDeployment = exports.createDeployment = exports.createRelease = void 0;
require("@niondigital/env-util");
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var commander_1 = require("commander");
exports["default"] = commander_1.program;
var create_1 = require("./commands/deployment/create");
exports.createDeployment = create_1["default"];
var create_2 = require("./commands/release/create");
exports.createRelease = create_2["default"];
var finish_1 = require("./commands/deployment/finish");
exports.finishDeployment = finish_1["default"];
var getPlugins_1 = require("./base/getPlugins");
var packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));
console.log();
console.log(chalk.gray('[niondigital-release]'), chalk.white("version ".concat(packageJson.version)));
commander_1.program.version(packageJson.version, '-v, --version', 'output the current version');
var releaseCommand = commander_1.program.command('release').description('Release operations');
releaseCommand
    .command('create')
    .option('-d, --dry-run', 'Perform a dry-run without creating a release')
    .description('Create a release in the current Git branch')
    .action(function (options) {
    (0, create_2["default"])(!!options.dryRun)["catch"](function (error) {
        console.error(error);
    });
});
var deploymentCommand = commander_1.program.command('deployment').description('Deployment operations');
deploymentCommand
    .command('create')
    .description('Create a deployment by merging a release into a deployment branch')
    .action(function () {
    (0, create_1["default"])()["catch"](function (error) {
        console.error(error);
    });
});
deploymentCommand
    .command('finish')
    .description('Finish a deployment')
    .action(function () {
    (0, finish_1["default"])()["catch"](function (error) {
        console.error(error);
    });
});
(0, getPlugins_1["default"])().then(function (plugins) {
    plugins.forEach(function (plugin) { return plugin.init(commander_1.program); });
    console.log();
    commander_1.program.parse(process.argv);
});

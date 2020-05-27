#!/usr/bin/env node
"use strict";
exports.__esModule = true;
require("@seibert-io/heyday-env");
var fs = require("fs");
var path = require("path");
var commander_1 = require("commander");
exports["default"] = commander_1.program;
var deploy_1 = require("./commands/deploy");
exports.deploy = deploy_1["default"];
var release_1 = require("./commands/release");
exports.release = release_1["default"];
var node_1 = require("@seibert-io/heyday-sentry/dist/node");
var packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));
commander_1.program.version(packageJson.version, '-v, --version', 'output the current version');
commander_1.program
    .command('deploy')
    .description('Create a deployment')
    .action(function () {
    deploy_1["default"]()["catch"](node_1.captureAndLogError);
});
commander_1.program
    .command('release')
    .option('-d, --dry-run', 'Perform a dry-run without creating a release')
    .description('Create a release in the current Git branch')
    .action(function (options) {
    release_1["default"](!!options.dryRun)["catch"](node_1.captureAndLogError);
});
commander_1.program.parse(process.argv);

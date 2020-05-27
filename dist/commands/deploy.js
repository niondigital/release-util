"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var shell = require("shelljs");
var inquirer = require("inquirer");
var chalk_1 = require("chalk");
function getDeploymentBranches() {
    if (!process.env.DEPLOYMENT_BRANCHES) {
        throw new Error('Please specify a comma-separated list of deployment branches via environment variable DEPLOYMENT_BRANCHES');
    }
    return process.env.DEPLOYMENT_BRANCHES.split(',').map(function (branch) { return branch.trim(); });
}
function deploy() {
    return __awaiter(this, void 0, void 0, function () {
        var deploymentBranches, gitTagOutput, releaseTagChoices, deployBranchName, tagName, currentBranchName, hasLocalChanges, statusResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deploymentBranches = getDeploymentBranches();
                    console.log("\n" + chalk_1["default"].red('Attention:\n') + " - This command operates on multiple branches - consider commiting local changes first.\n - Make sure branches " + deploymentBranches.join(', ') + " exist locally and are set to follow to their origin/x counterparts.\n");
                    shell.exec('git fetch --all', { silent: true });
                    gitTagOutput = shell.exec("git tag -l --sort=-v:refname --format='%(refname:short)|%(creatordate)'", { silent: true });
                    releaseTagChoices = gitTagOutput.stdout
                        .split('\n')
                        .filter(function (tagString) { return !!tagString; })
                        .map(function (tagString) {
                        var _a = tagString.split('|'), tagName = _a[0], creatorDate = _a[1];
                        var creatorDateObject = new Date(creatorDate);
                        return {
                            value: tagName,
                            short: tagName,
                            name: tagName.padEnd(12, ' ') + "   (" + creatorDateObject.getDate() + "." + (creatorDateObject.getMonth() +
                                1) + "." + creatorDateObject.getFullYear() + ")"
                        };
                    });
                    if (releaseTagChoices.length === 0) {
                        console.log(chalk_1["default"].red('Error') + " No release exist that could be deployed.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'list',
                                name: 'deployBranchName',
                                message: 'Choose branch/environment to deploy to',
                                choices: deploymentBranches
                            }
                        ])];
                case 1:
                    deployBranchName = (_a.sent()).deployBranchName;
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'list',
                                name: 'tagName',
                                message: 'Choose release to deploy into the selected deployment branch',
                                choices: releaseTagChoices
                            }
                        ])];
                case 2:
                    tagName = (_a.sent()).tagName;
                    currentBranchName = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout;
                    currentBranchName = currentBranchName.replace('\n', '');
                    hasLocalChanges = false;
                    statusResult = shell.exec('git status --porcelain');
                    hasLocalChanges = statusResult.stdout.split('\n').length > 1;
                    if (hasLocalChanges)
                        shell.exec('git stash');
                    shell.exec("git checkout " + deployBranchName);
                    shell.exec("git reset --hard " + tagName);
                    shell.exec('git push --force');
                    if (deployBranchName !== currentBranchName) {
                        shell.exec("git checkout " + currentBranchName);
                        if (hasLocalChanges)
                            shell.exec('git stash pop');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = deploy;

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var chalk_1 = require("chalk");
var Plugin_1 = require("../base/Plugin");
/* eslint-disable @typescript-eslint/no-unused-vars */
var SentryPlugin = /** @class */ (function (_super) {
    __extends(SentryPlugin, _super);
    function SentryPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SentryPlugin.prototype.getName = function () {
        return 'heyday-release-sentry';
    };
    SentryPlugin.prototype.init = function (rootProgram) {
        var _this = this;
        var sentryCommand = rootProgram.command('sentry').description('Sentry operations');
        sentryCommand
            .command('create-deployment')
            .description('Notify sentry of a deployment')
            .action(function () {
            _this.afterDeploymentFinished()["catch"](function (error) {
                console.error(error);
            });
        });
        sentryCommand
            .command('create-release')
            .description('Notify sentry of a release')
            .action(function () {
            _this.afterCreateRelease(false)["catch"](function (error) {
                console.error(error);
            });
        });
        this.log('Plugin initialized');
    };
    SentryPlugin.prototype.beforeCreateRelease = function (dryRun) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    /**
     * Notify Sentry of the new release so issues can be linked with releases
     * and commit suggestions can be made
     */
    SentryPlugin.prototype.afterCreateRelease = function (dryRun) {
        return __awaiter(this, void 0, void 0, function () {
            var currentVersion, sentryProject, releaseCommitRef;
            return __generator(this, function (_a) {
                if (dryRun)
                    return [2 /*return*/];
                // only execute if sentry is enabled per environment config
                if (!SentryPlugin.isSentryEnabled()) {
                    this.log(chalk_1["default"].yellow('Environment variable SENTRY_ENABLED not set or explicitly disabling Sentry - skipping sentry release...'));
                    return [2 /*return*/];
                }
                this.log(chalk_1["default"].white('Sentry is enabled - starting Sentry release...'));
                currentVersion = process.env.npm_package_name + "@" + process.env.npm_package_version;
                this.log(chalk_1["default"].white("Sentry release version: " + currentVersion));
                if (!process.env.SENTRY_AUTH_TOKEN) {
                    throw new Error('Please set environment variable SENTRY_AUTH_TOKEN');
                }
                if (!process.env.SENTRY_ORG) {
                    throw new Error('Please set environment variable SENTRY_ORG');
                }
                if (!process.env.SENTRY_PROJECT) {
                    throw new Error('Please set environment variable SENTRY_PROJECT');
                }
                shell.env.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
                shell.env.SENTRY_ORG = process.env.SENTRY_ORG || '';
                sentryProject = process.env.SENTRY_PROJECT || '';
                // Create a Sentry release
                shell.exec("sentry-cli releases new --finalize -p " + sentryProject + " \"" + currentVersion + "\"", { silent: false });
                if (process.env.SENTRY_REPOSITORY_ID) {
                    releaseCommitRef = shell
                        .exec('git log -1 --format="%H"', { silent: true })
                        .toString()
                        .replace(/([\n\r])/, '');
                    shell.exec("sentry-cli releases set-commits \"" + currentVersion + "\" --commit \"" + process.env.SENTRY_REPOSITORY_ID + "@" + releaseCommitRef + "\"", { silent: false });
                }
                else {
                    this.log(chalk_1["default"].yellow('Environment variable SENTRY_REPOSITORY_ID not set - skipping associating commits...'));
                }
                this.log(chalk_1["default"].greenBright('Sentry release completed'));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Notify Sentry of a deployment of a release
     */
    SentryPlugin.prototype.afterDeploymentFinished = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentVersion, releaseCommitRef;
            return __generator(this, function (_a) {
                if (!SentryPlugin.isSentryEnabled()) {
                    console.info('[finish-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...');
                    return [2 /*return*/];
                }
                if (process.env.SENTRY_NOTIFY_OF_DEPLOYMENT !== '1') {
                    console.info('[finish-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...');
                    return [2 /*return*/];
                }
                console.log(chalk_1["default"].white('[complete-deployment] Notifying Sentry of release deployment...'));
                currentVersion = process.env.npm_package_name + "@" + process.env.npm_package_version;
                console.log(chalk_1["default"].white("[complete-deployment] Sentry release version to deploy: " + currentVersion));
                shell.env.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
                shell.env.SENTRY_ORG = process.env.SENTRY_ORG || '';
                // Notify of release deployment
                shell.exec("sentry-cli releases deploys \"" + currentVersion + "\" new -e \"" + process.env.SENTRY_ENVIRONMENT + "\" -u \"" + process.env.DEPLOY_URL + "\"", { silent: false });
                if (process.env.SENTRY_REPOSITORY_ID) {
                    releaseCommitRef = shell
                        .exec('git log -1 --format="%H"', { silent: true })
                        .toString()
                        .replace(/(\[n|\r])/, '');
                    shell.exec("sentry-cli releases set-commits \"" + currentVersion + "\" --commit \"" + process.env.SENTRY_REPOSITORY_ID + "@" + releaseCommitRef + "\"", { silent: false });
                }
                console.log(chalk_1["default"].greenBright('[complete-deployment] Sentry release deployment completed'));
                return [2 /*return*/];
            });
        });
    };
    SentryPlugin.isSentryEnabled = function () {
        return !['false', '0', ''].includes(String(process.env.SENTRY_ENABLED).toLowerCase());
    };
    SentryPlugin.prototype.log = function (message) {
        console.log(chalk_1["default"].gray("[" + this.getName() + "]") + " " + message);
    };
    return SentryPlugin;
}(Plugin_1["default"]));
exports["default"] = SentryPlugin;
/* eslint-enable @typescript-eslint/no-unused-vars */

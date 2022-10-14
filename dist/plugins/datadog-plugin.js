"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var fs = require("fs");
var path = require("path");
var appRoot = require("app-root-path");
var Plugin_1 = require("../base/Plugin");
/* eslint-disable @typescript-eslint/no-unused-vars */
var DatadogPlugin = /** @class */ (function (_super) {
    __extends(DatadogPlugin, _super);
    function DatadogPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DatadogPlugin.prototype.getName = function () {
        return 'niondigital-release-datadog';
    };
    DatadogPlugin.prototype.init = function (rootProgram) {
        var _this = this;
        var sentryCommand = rootProgram.command('datadog').description('Datadog operations');
        sentryCommand
            .command('upload-sourcemaps')
            .description('Upload source maps to Datadog')
            .action(function () {
            _this.afterCreateRelease(false)["catch"](function (error) {
                console.error(error);
            });
        });
        this.log('Plugin initialized');
    };
    DatadogPlugin.prototype.beforeCreateRelease = function (dryRun) {
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
    DatadogPlugin.prototype.afterCreateRelease = function (dryRun) {
        return __awaiter(this, void 0, void 0, function () {
            var packageJson, currentVersion, sourceMapPaths;
            return __generator(this, function (_a) {
                if (dryRun)
                    return [2 /*return*/];
                // only execute if sentry is enabled per environment config
                if (!DatadogPlugin.isDatadogEnabled()) {
                    this.log(chalk_1["default"].yellow('Environment variable DATADOG_ENABLED not set or explicitly disabling Datadog - skipping datadog release...'));
                    return [2 /*return*/];
                }
                this.log(chalk_1["default"].white('DataDog is enabled - uploading source maps...'));
                packageJson = JSON.parse(String(fs.readFileSync(path.resolve(String(appRoot), './package.json'))));
                currentVersion = packageJson.version;
                this.log(chalk_1["default"].white("Datadog release version: ".concat(currentVersion)));
                if (!process.env.DATADOG_API_KEY) {
                    throw new Error('Please set environment variable DATADOG_API_KEY');
                }
                shell.env.DATADOG_API_KEY = process.env.DATADOG_API_KEY;
                if (process.env.DATADOG_SITE) {
                    shell.env.DATADOG_SITE = process.env.DATADOG_SITE;
                }
                if (process.env.DATADOG_API_HOST) {
                    shell.env.DATADOG_API_HOST = process.env.DATADOG_API_HOST;
                }
                // Upload source maps (if paths are provided)
                if (process.env.DATADOG_SOURCEMAPS) {
                    sourceMapPaths = (process.env.DATADOG_SOURCEMAPS || '').split(',');
                    sourceMapPaths.forEach(function (sourceMapPath) {
                        shell.exec("datadog-ci sourcemaps upload ".concat(sourceMapPath, " --release-version '").concat(currentVersion, "'"), {
                            silent: false
                        });
                    });
                }
                this.log(chalk_1["default"].greenBright('Datadog release completed'));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Notify Sentry of a deployment of a release
     */
    DatadogPlugin.prototype.afterDeploymentFinished = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DatadogPlugin.isDatadogEnabled = function () {
        return !['false', '0', ''].includes(String(process.env.DATADOG_ENABLED).toLowerCase());
    };
    DatadogPlugin.prototype.log = function (message) {
        console.log("".concat(chalk_1["default"].gray("[".concat(this.getName(), "]")), " ").concat(message));
    };
    return DatadogPlugin;
}(Plugin_1["default"]));
exports["default"] = DatadogPlugin;
/* eslint-enable @typescript-eslint/no-unused-vars */

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
var chalk = require("chalk");
var Plugin_1 = require("../base/Plugin");
/* eslint-disable @typescript-eslint/no-unused-vars */
var NetlifyPlugin = /** @class */ (function (_super) {
    __extends(NetlifyPlugin, _super);
    function NetlifyPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NetlifyPlugin.prototype.getName = function () {
        return 'niondigital-release-netlify';
    };
    NetlifyPlugin.prototype.init = function (rootProgram) {
        this.log('Plugin initialized');
    };
    /**
     * Netlify only clones the repo as a shallow copy. If we're in a Netlify build context, the current working branch reported by Git will be != process.env.BRANCH reported by Netlify.
     * We will need to switch to the real branch first to make a release commit in the process.env.BRANCH branch.
     * The commit we're releasing for is provided by Netlify in env.COMMIT_REF, so we will also reset the build branch to this commit
     *
     * !Warning! Don't try this locally - this will meddle with your local git repo!
     * If you absolutely must enforce using this locally (by setting env.NETLIFY, env.BRANCH and env.COMMIT_REF):
     * Always explicitly reset the release branch to HEAD and switch back to our working branch afterwards.
     * Seriously.
     */
    NetlifyPlugin.prototype.beforeCreateRelease = function (dryRun) {
        return __awaiter(this, void 0, void 0, function () {
            var workdirBranch, buildBranch;
            return __generator(this, function (_a) {
                // only operate in Netlify build context
                if (!process.env.NETLIFY || !process.env.BRANCH || !process.env.COMMIT_REF) {
                    this.log(chalk.yellow('Operating outside Netlify build context. Skipping Netlify Git setup handling.'));
                    return [2 /*return*/, true];
                }
                this.log(chalk.gray('Netlify build context detected. Verifying local copy'));
                workdirBranch = shell
                    .exec('git rev-parse --abbrev-ref HEAD', { silent: true })
                    .toString()
                    .replace(/([\n\r])/, '');
                buildBranch = process.env.BRANCH || workdirBranch;
                // ! Kids, don't try this at home - this will meddle with your local git repo!
                if (workdirBranch !== buildBranch) {
                    this.log(chalk.white("Netlify reported build branch '".concat(buildBranch, "', but local copy is '").concat(workdirBranch, "'. Checking out build branch...")));
                    // env.BRANCH is different from what Git reports as being the current branch
                    shell.exec("git branch -f ".concat(buildBranch, " ").concat(process.env.COMMIT_REF), { silent: true });
                    shell.exec("git checkout ".concat(buildBranch), { silent: true });
                }
                this.log(chalk.greenBright("Local branch is '".concat(buildBranch, "'.")));
                return [2 /*return*/, true];
            });
        });
    };
    /**
     * Notify Sentry of the new release so issues can be linked with releases
     * and commit suggestions can be made
     */
    NetlifyPlugin.prototype.afterCreateRelease = function (dryRun) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * Notify Sentry of a deployment of a release
     */
    NetlifyPlugin.prototype.afterDeploymentFinished = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    NetlifyPlugin.prototype.log = function (message) {
        console.log("".concat(chalk.gray("[".concat(this.getName(), "]")), " ").concat(message));
    };
    return NetlifyPlugin;
}(Plugin_1["default"]));
exports["default"] = NetlifyPlugin;
/* eslint-enable @typescript-eslint/no-unused-vars */

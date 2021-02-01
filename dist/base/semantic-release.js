"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var appRoot = require("app-root-path");
function getSemanticReleaseOptions() {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    var baseOptions = require(path.resolve(__dirname, '../../release.config.base.js')); // eslint-disable-line @typescript-eslint/no-var-requires
    var localOptionsFilename = appRoot + "/release.config.js";
    return fs.existsSync(localOptionsFilename) ? {} : baseOptions;
}
exports.getSemanticReleaseOptions = getSemanticReleaseOptions;

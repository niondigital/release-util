"use strict";
exports.__esModule = true;
var SentryPlugin_1 = require("../plugins/SentryPlugin");
function getPlugins() {
    var plugins = [new SentryPlugin_1["default"]()];
    var releasePlugins = process.env.RELEASE_PLUGINS;
    if (releasePlugins) {
        releasePlugins.split('.').forEach(function (pluginName) {
            plugins.push(require(pluginName)); // eslint-disable-line @typescript-eslint/no-var-requires
        });
    }
    return plugins;
}
exports["default"] = getPlugins;

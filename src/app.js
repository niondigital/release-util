#!/usr/bin/env node

const path = require('path'); // eslint-disable-line

require('ts-node').register({
	project: path.resolve(__dirname, '../tsconfig.node.json')
});
require('tsconfig-paths').register();
require(path.resolve(__dirname, './app.ts'));

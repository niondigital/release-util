#!/usr/bin/env node

require('ts-node').register({
	project: './tsconfig.node.json'
});
require('tsconfig-paths').register();
require('./app.ts');

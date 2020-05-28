#!/usr/bin/env node

import '@madebyheyday/env-util';
import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import deploy from './commands/deploy';
import release from './commands/release';
import { completeDeployment } from './commands/complete-deployment';
import Plugin from './base/Plugin';
import getPlugins from './base/getPlugins';

const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));
program.version(packageJson.version, '-v, --version', 'output the current version');

program
	.command('release')
	.option('-d, --dry-run', 'Perform a dry-run without creating a release')
	.description('Create a release in the current Git branch')
	.action((options: any) => {
		release(!!options.dryRun).catch((error: Error) => {
			console.error(error);
		});
	});

program
	.command('deploy')
	.description('Create a deployment by merging a release into a deployment branch')
	.action(() => {
		deploy().catch((error: Error) => {
			console.error(error);
		});
	});

program
	.command('complete-deployment')
	.description('Mark a deployment as completed')
	.action(() => {
		completeDeployment().catch((error: Error) => {
			console.error(error);
		});
	});

getPlugins().forEach((plugin: Plugin): void => plugin.init());

program.parse(process.argv);

export { release, deploy, completeDeployment, program as default };

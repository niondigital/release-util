#!/usr/bin/env node

import '@seibert-io/heyday-env';
import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import deploy from './commands/deploy';
import release from './commands/release';
import { captureAndLogError } from '@seibert-io/heyday-sentry/dist/node';
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
		release(!!options.dryRun).catch(captureAndLogError);
	});

program
	.command('deploy')
	.description('Create a deployment by merging a release into a deployment branch')
	.action(() => {
		deploy().catch(captureAndLogError);
	});

program
	.command('complete-deployment')
	.description('Mark a deployment as completed')
	.action(() => {
		completeDeployment().catch(captureAndLogError);
	});

getPlugins().forEach((plugin: Plugin): void => plugin.init());

program.parse(process.argv);

export { release, deploy, completeDeployment, program as default };

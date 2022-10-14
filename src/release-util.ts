#!/usr/bin/env node

import '@niondigital/env-util';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { program } from 'commander';
import createDeployment from './commands/deployment/create';
import createRelease from './commands/release/create';
import finishDeployment from './commands/deployment/finish';
import Plugin from './base/Plugin';
import getPlugins from './base/getPlugins';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(path.dirname(__filename), '../package.json'))));

console.log();
console.log(chalk.gray('[niondigital-release]'), chalk.white(`version ${packageJson.version}`));

program.version(packageJson.version, '-v, --version', 'output the current version');

const releaseCommand = program.command('release').description('Release operations');

releaseCommand
	.command('create')
	.option('-d, --dry-run', 'Perform a dry-run without creating a release')
	.description('Create a release in the current Git branch')
	.action((options: any) => {
		createRelease(!!options.dryRun).catch((error: Error) => {
			console.error(error);
		});
	});

const deploymentCommand = program.command('deployment').description('Deployment operations');

deploymentCommand
	.command('create')
	.description('Create a deployment by merging a release into a deployment branch')
	.action(() => {
		createDeployment().catch((error: Error) => {
			console.error(error);
		});
	});

deploymentCommand
	.command('finish')
	.description('Finish a deployment')
	.action(() => {
		finishDeployment().catch((error: Error) => {
			console.error(error);
		});
	});

getPlugins().then((plugins: Plugin[]): void => {
	plugins.forEach((plugin: Plugin): void => plugin.init(program));
	console.log();
	program.parse(process.argv);
});

// eslint-disable-next-line no-restricted-exports
export { createRelease, createDeployment, finishDeployment, program as default };

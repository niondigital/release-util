#!/usr/bin/env node

import '@niondigital/env-util';
import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import createDeployment from './commands/deployment/create';
import createRelease from './commands/release/create';
import finishDeployment from './commands/deployment/finish';
import Plugin from './base/Plugin';
import getPlugins from './base/getPlugins';
import * as chalk from 'chalk';

const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));

console.log();
console.log(chalk.gray('[heyday-release]'), chalk.white(`version ${packageJson.version}`));

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

export { createRelease, createDeployment, finishDeployment, program as default };

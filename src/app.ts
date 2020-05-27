import '@libraries/utils/env';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import deploy from './commands/deploy';
import release from './commands/release';

const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));
program.version(packageJson.version, '-v, --version', 'output the current version');
import { captureAndLogError } from '@seibert-io/heyday-sentry/src/node';

program
	.command('deploy')
	.description('Create a deployment')
	.action(() => {
		deploy().catch(captureAndLogError);
	});

program
	.command('release')
	.description('Create a release in the current Git branch')
	.action(() => {
		release().catch(captureAndLogError);
	});

program.parse(process.argv);

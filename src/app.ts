import '@seibert-io/heyday-env';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import deploy from './commands/deploy';
import release from './commands/release';
import { captureAndLogError } from '@seibert-io/heyday-sentry/dist/node';

const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));
program.version(packageJson.version, '-v, --version', 'output the current version');

program
	.command('deploy')
	.description('Create a deployment')
	.action(() => {
		deploy().catch(captureAndLogError);
	});

program
	.command('release')
	.option('-d, --dry-run', 'Perform a dry-run without creating a release')
	.description('Create a release in the current Git branch')
	.action((options: any) => {
		release(!!options.dryRun).catch(captureAndLogError);
	});

program.parse(process.argv);

export { deploy, release, program as default };

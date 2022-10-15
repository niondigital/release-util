import * as shell from 'shelljs';
import chalk from 'chalk';
import * as program from 'commander'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as fs from 'fs';
import * as path from 'path';
import appRoot from 'app-root-path';
import Plugin from '../base/Plugin';

/* eslint-disable @typescript-eslint/no-unused-vars */

export default class DatadogPlugin extends Plugin {
	public getName(): string {
		return 'niondigital-release-datadog';
	}

	public init(rootProgram: program.Command): void {
		const sentryCommand = rootProgram.command('datadog').description('Datadog operations');

		sentryCommand
			.command('upload-sourcemaps')
			.description('Upload source maps to Datadog')
			.action(() => {
				this.afterCreateRelease(false).catch((error: Error) => {
					console.error(error);
				});
			});

		this.log('Plugin initialized');
	}

	public async beforeCreateRelease(dryRun: boolean): Promise<boolean> {
		return true;
	}

	/**
	 * Notify Sentry of the new release so issues can be linked with releases
	 * and commit suggestions can be made
	 */
	public async afterCreateRelease(dryRun: boolean): Promise<void> {
		if (dryRun) return;

		// only execute if sentry is enabled per environment config
		if (!DatadogPlugin.isDatadogEnabled()) {
			this.log(
				chalk.yellow(
					'Environment variable DATADOG_ENABLED not set or explicitly disabling Datadog - skipping datadog release...'
				)
			);
			return;
		}

		this.log(chalk.white('DataDog is enabled - uploading source maps...'));

		// use fresh version info from package.json instead of using process.env.npm_package_version as version was changed by semantic-release since app start
		const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(String(appRoot), './package.json'))));
		const currentVersion = packageJson.version;

		this.log(chalk.white(`Datadog release version: ${currentVersion}`));

		if (!process.env.DATADOG_API_KEY) {
			throw new Error('Please set environment variable DATADOG_API_KEY');
		}

		shell.env.DATADOG_API_KEY = process.env.DATADOG_API_KEY;

		if (process.env.DATADOG_SITE) {
			shell.env.DATADOG_SITE = process.env.DATADOG_SITE;
		}

		if (process.env.DATADOG_API_HOST) {
			shell.env.DATADOG_API_HOST = process.env.DATADOG_API_HOST;
		}

		// Upload source maps (if paths are provided)
		if (process.env.DATADOG_SOURCEMAPS) {
			// multiple source map configs may be provided, separated by comma
			// each config must consist of a path and can optionally be prefixed  with options to pass to sentry-cli releases files ,
			// like `--ext js --ext ts --ext tsx --ext jsx --ext map`
			const sourceMapPaths: string[] = (process.env.DATADOG_SOURCEMAPS || '').split(',');
			sourceMapPaths.forEach((sourceMapPath: string) => {
				shell.exec(`datadog-ci sourcemaps upload ${sourceMapPath} --release-version '${currentVersion}'`, {
					silent: false
				});
			});
		}

		this.log(chalk.greenBright('Datadog release completed'));
	}

	/**
	 * Notify Sentry of a deployment of a release
	 */
	public async afterDeploymentFinished(): Promise<void> {
		//
	}

	private static isDatadogEnabled(): boolean {
		return !['false', '0', ''].includes(String(process.env.DATADOG_ENABLED).toLowerCase());
	}

	private log(message: string): void {
		console.log(`${chalk.gray(`[${this.getName()}]`)} ${message}`);
	}
}

/* eslint-enable @typescript-eslint/no-unused-vars */

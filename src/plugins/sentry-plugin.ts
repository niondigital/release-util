import * as shell from 'shelljs';
import chalk from 'chalk';
import * as program from 'commander'; // eslint-disable-line @typescript-eslint/no-unused-vars
import Plugin from '../base/Plugin';

/* eslint-disable @typescript-eslint/no-unused-vars */

export default class SentryPlugin extends Plugin {
	public getName(): string {
		return 'heyday-release-sentry';
	}

	public init(rootProgram: program.Command): void {
		const sentryCommand = rootProgram.command('sentry').description('Sentry operations');

		sentryCommand
			.command('create-deployment')
			.description('Notify sentry of a deployment')
			.action(() => {
				this.afterDeploymentFinished().catch((error: Error) => {
					console.error(error);
				});
			});

		sentryCommand
			.command('create-release')
			.description('Notify sentry of a release')
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
		if (!SentryPlugin.isSentryEnabled()) {
			this.log(
				chalk.yellow(
					'Environment variable SENTRY_ENABLED not set or explicitly disabling Sentry - skipping sentry release...'
				)
			);
			return;
		}

		this.log(chalk.white('Sentry is enabled - starting Sentry release...'));

		const currentVersion = `${process.env.npm_package_name}@${process.env.npm_package_version}`;
		this.log(chalk.white(`Sentry release version: ${currentVersion}`));

		if (!process.env.SENTRY_AUTH_TOKEN) {
			throw new Error('Please set environment variable SENTRY_AUTH_TOKEN');
		}

		if (!process.env.SENTRY_ORG) {
			throw new Error('Please set environment variable SENTRY_ORG');
		}

		if (!process.env.SENTRY_PROJECT) {
			throw new Error('Please set environment variable SENTRY_PROJECT');
		}

		shell.env.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
		shell.env.SENTRY_ORG = process.env.SENTRY_ORG || '';

		const sentryProject = process.env.SENTRY_PROJECT || '';

		// Create a Sentry release
		shell.exec(`sentry-cli releases new --finalize -p ${sentryProject} "${currentVersion}"`, { silent: false });

		if (process.env.SENTRY_REPOSITORY_ID) {
			// Associate latest commit with the release
			const releaseCommitRef = shell
				.exec('git log -1 --format="%H"', { silent: true })
				.toString()
				.replace(/([\n\r])/, '');

			shell.exec(
				`sentry-cli releases set-commits "${currentVersion}" --commit "${process.env.SENTRY_REPOSITORY_ID}@${releaseCommitRef}"`,
				{ silent: false }
			);
		} else {
			this.log(chalk.yellow('Environment variable SENTRY_REPOSITORY_ID not set - skipping associating commits...'));
		}
		this.log(chalk.greenBright('Sentry release completed'));
	}

	/**
	 * Notify Sentry of a deployment of a release
	 */
	public async afterDeploymentFinished(): Promise<void> {
		if (!SentryPlugin.isSentryEnabled()) {
			console.info(
				'[finish-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...'
			);
			return;
		}

		if (process.env.SENTRY_NOTIFY_OF_DEPLOYMENT !== '1') {
			console.info(
				'[finish-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...'
			);
			return;
		}

		console.log(chalk.white('[complete-deployment] Notifying Sentry of release deployment...'));

		const currentVersion = `${process.env.npm_package_name}@${process.env.npm_package_version}`;
		console.log(chalk.white(`[complete-deployment] Sentry release version to deploy: ${currentVersion}`));

		shell.env.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
		shell.env.SENTRY_ORG = process.env.SENTRY_ORG || '';

		// Notify of release deployment
		shell.exec(
			`sentry-cli releases deploys "${currentVersion}" new -e "${process.env.SENTRY_ENVIRONMENT}" -u "${process.env.DEPLOY_URL}"`,
			{ silent: false }
		);

		if (process.env.SENTRY_REPOSITORY_ID) {
			// Associate latest commit with the release
			const releaseCommitRef = shell
				.exec('git log -1 --format="%H"', { silent: true })
				.toString()
				.replace(/(\[n|\r])/, '');

			shell.exec(
				`sentry-cli releases set-commits "${currentVersion}" --commit "${process.env.SENTRY_REPOSITORY_ID}@${releaseCommitRef}"`,
				{ silent: false }
			);
		}

		console.log(chalk.greenBright('[complete-deployment] Sentry release deployment completed'));
	}

	private static isSentryEnabled(): boolean {
		return !['false', '0', ''].includes(String(process.env.SENTRY_ENABLED).toLowerCase());
	}

	private log(message: string): void {
		console.log(`${chalk.gray(`[${this.getName()}]`)} ${message}`);
	}
}

/* eslint-enable @typescript-eslint/no-unused-vars */

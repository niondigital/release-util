import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import chalk from 'chalk';

/**
 * Notify Sentry of a deployment of a release
 */
async function notifySentryOfDeployment(): Promise<void> {
	if (['false', '0', ''].includes(String(process.env.SENTRY_ENABLED).toLowerCase())) {
		console.info(
			'[complete-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...'
		);
		return;
	}

	if (process.env.SENTRY_NOTIFY_OF_DEPLOYMENT !== '1') {
		console.info(
			'[complete-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...'
		);
		return;
	}

	console.log(chalk.white('[complete-deployment] Notifying Sentry of release deployment...'));

	const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(__dirname, '../package.json'))));
	const currentVersion = `${packageJson.name}@${packageJson.version}`;
	console.log(chalk.white(`[complete-deployment] Sentry release version to deploy: ${currentVersion}`));

	shell.env.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
	shell.env.SENTRY_ORG = process.env.SENTRY_ORG || '';

	// Notify of release deployment
	shell.exec(
		`sentry-cli releases deploys "${currentVersion}" new -e "${process.env.SENTRY_ENVIRONMENT}" -u "${process.env.DEPLOY_URL}"`,
		{ silent: false }
	);

	console.log(chalk.greenBright('[complete-deployment] Sentry release deployment completed'));
}

export async function completeDeployment(): Promise<void> {
	await notifySentryOfDeployment();
	console.log('[complete-deployment] Finished');
}

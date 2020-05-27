import '@libraries/utils/env';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import chalk from 'chalk';
import semanticRelease from 'semantic-release';
import appRoot from 'app-root-path';

function getSemanticReleaseOptions(): semanticRelease.Options {
	const baseOptions: semanticRelease.Options = require(path.resolve(__dirname, '../../release.config.base.js')); // eslint-disable-line @typescript-eslint/no-var-requires
	const localOptionsFilename: string = `${appRoot}release.config.js`;

	return fs.existsSync(localOptionsFilename) ? JSON.parse(fs.readFileSync(localOptionsFilename, 'utf8')) : baseOptions;
}

/**
 * Notify Sentry of the new release so issues can be linked with releases
 * and commit suggestions can be made
 */
async function notifySentryOfRelease(): Promise<void> {
	// only execute if sentry is enabled per environment config
	if (['false', '0', ''].includes(String(process.env.SENTRY_ENABLED).toLowerCase())) {
		console.info(
			'Environment variable SENTRY_ENABLED not set or explictly disabling Sentry - skipping sentry release...'
		);
		return;
	}

	console.log(chalk.white('[release] Starting Sentry release...'));

	const currentVersion = `${process.env.npm_package_name}@${process.env.npm_package_version}`;
	console.log(chalk.white(`[release] Sentry release version: ${currentVersion}`));

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
			.replace(/(\n|\r)/, '');

		shell.exec(
			`sentry-cli releases set-commits "${currentVersion}" --commit "${process.env.SENTRY_REPOSITORY_ID}@${releaseCommitRef}"`,
			{ silent: false }
		);
	} else {
		console.info('Environment variable SENTRY_REPOSITORY_ID not set - skipping associating commits...');
	}
	console.log(chalk.greenBright('[release] Sentry release completed'));
}

/**
 * Create semantic release:
 * - Updates Changelog
 * - Bumps package.json version
 * - Commits and pushes package.json and Changelog
 */
async function executeSemanticRelease(): Promise<boolean> {
	console.log(chalk.white('[release] Starting semantic release...'));

	const result: semanticRelease.Result = await semanticRelease(getSemanticReleaseOptions());

	if (!result || result.lastRelease.version === result.nextRelease.version) {
		console.log(chalk.yellow('[release] No release created'));
		return false;
	}

	console.log(chalk.greenBright(`[release] Release created: ${result.nextRelease.version}`));
	return true;
}

export default async function release(): Promise<void> {
	// (changelog, version bump, git commit)
	await notifySentryOfRelease();
	const releaseCreated: boolean = await executeSemanticRelease();

	if (releaseCreated) {
		process.exit();
	} else {
		process.exit(1);
	}
	// add further release steps here that may take place after creating the release
}

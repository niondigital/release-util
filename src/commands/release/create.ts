import chalk from 'chalk';
import * as semanticRelease from 'semantic-release';
import { getSemanticReleaseOptions } from '../../base/semantic-release';
import Plugin from '../../base/Plugin';
import getPlugins from '../../base/getPlugins';

function log(message: string): void {
	console.log(`${chalk.gray('[createRelease]')} ${message}`);
}

/**
 * Create semantic release:
 * - Updates Changelog
 * - Bumps package.json version
 * - Commits and pushes package.json and Changelog
 */
async function executeSemanticRelease(dryRun: boolean = false): Promise<boolean> {
	const result: semanticRelease.Result = await semanticRelease({ ...getSemanticReleaseOptions(), dryRun });

	if (!result || result.lastRelease.version === result.nextRelease.version) {
		log(chalk.yellow('No release created'));
		return false;
	}

	log(chalk.greenBright(`Release created: ${result.nextRelease.version}`));
	return true;
}

export default async function createRelease(dryRun: boolean = false): Promise<void> {
	log('Creating release...');

	const checks: boolean[] = await Promise.all(
		(await getPlugins()).map(
			(plugin: Plugin): Promise<boolean> => {
				return plugin.beforeCreateRelease(dryRun);
			}
		)
	);

	if (checks.includes(false)) {
		log(chalk.white('Release Prevented by plugin'));
	}

	// (changelog, version bump, git commit)
	const releaseCreated: boolean = await executeSemanticRelease(dryRun);

	if (releaseCreated) {
		await Promise.all(
			(await getPlugins()).map(
				(plugin: Plugin): Promise<void> => {
					return plugin.afterCreateRelease(dryRun);
				}
			)
		);

		log(chalk.greenBright('Finished'));
		process.exit();
	} else {
		log('Finished');
		process.exit(0);
	}
}

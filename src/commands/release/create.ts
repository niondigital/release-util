import * as shell from 'shelljs';
import chalk from 'chalk';
import * as semanticRelease from 'semantic-release';
import { getSemanticReleaseOptions } from '../../base/semantic-release';
import Plugin from '../../base/Plugin';
import getPlugins from '../../base/getPlugins';

/**
 * Create semantic release:
 * - Updates Changelog
 * - Bumps package.json version
 * - Commits and pushes package.json and Changelog
 */
async function executeSemanticRelease(dryRun: boolean = false): Promise<boolean> {
	console.log(chalk.white('[release] Starting semantic release...'));
	console.log(getSemanticReleaseOptions());
	const result: semanticRelease.Result = await semanticRelease({ ...getSemanticReleaseOptions(), dryRun });

	if (!result || result.lastRelease.version === result.nextRelease.version) {
		console.log(chalk.yellow('[release] No release created'));
		return false;
	}

	console.log(chalk.greenBright(`[release] Release created: ${result.nextRelease.version}`));
	return true;
}

/**
 * Netlify only clones the repo as a shallow copy. If we're in a Netlify build context, the current working branch reported by Git will be != process.env.BRANCH reported by Netlify.
 * We will need to switch to the real branch first to make a release commit in the process.env.BRANCH branch.
 * The commit we're releasing for is provided by Netlify in env.COMMIT_REF, so we will also reset the build branch to this commit
 *
 * !Warning! Don't try this locally - this will meddle with your local git repo!
 * If you absolutely must enforce using this locally (by setting env.NETLIFY, env.BRANCH and env.COMMIT_REF):
 * Always explicitly reset the release branch to HEAD and switch back to our working branch afterwards.
 * Seriously.
 */
function handleNetlifyGitSetup(): void {
	// only operate in Netlify build context
	if (!process.env.NETLIFY || !process.env.BRANCH || !process.env.COMMIT_REF) return;

	// working dir branch = branch reported by git (in Netlify this will be a commit, not a branch)
	const workdirBranch = shell
		.exec('git rev-parse --abbrev-ref HEAD', { silent: true })
		.toString()
		.replace(/(\n|\r)/, '');

	// build branch as provided in env by Netlify, working dir branch as a fallback (= working dir is on a real branch)
	const buildBranch = process.env.BRANCH || workdirBranch;

	// ! Kids, don't try this at home - this will meddle with your local git repo!
	// !
	if (workdirBranch !== buildBranch) {
		// env.BRANCH is different from what Git reports as being the current branch
		shell.exec(`git branch -f ${buildBranch} ${process.env.COMMIT_REF}`, { silent: true });
		shell.exec(`git checkout ${buildBranch}`, { silent: true });
	}
}

export default async function createRelease(dryRun: boolean = false): Promise<void> {
	handleNetlifyGitSetup();

	const checks: boolean[] = await Promise.all(
		(await getPlugins()).map(
			(plugin: Plugin): Promise<boolean> => {
				return plugin.beforeCreateRelease(dryRun);
			}
		)
	);

	if (checks.includes(false)) {
		console.log('[release] Release Prevented by plugin');
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

		console.log('[release] Finished');
		process.exit();
	} else {
		console.log('[release] Nothing to do');
		process.exit(1);
	}
}

import chalk from 'chalk';
import SemanticRelease from "semantic-release";
import { getSemanticReleaseOptions } from '../../base/semantic-release';
import getPlugins from '../../base/getPlugins';
function log(message) {
    console.log(`${chalk.gray('[createRelease]')} ${message}`);
}
/**
 * Create semantic release:
 * - Updates Changelog
 * - Bumps package.json version
 * - Commits and pushes package.json and Changelog
 */
async function executeSemanticRelease(dryRun = false) {
    const result = await SemanticRelease({ ...getSemanticReleaseOptions(), dryRun });
    if (!result || result.lastRelease.version === result.nextRelease.version) {
        log(chalk.yellow('No release created'));
        return false;
    }
    log(chalk.greenBright(`Release created: ${result.nextRelease.version}`));
    return true;
}
export default async function createRelease(dryRun = false) {
    log('Creating release...');
    const checks = await Promise.all((await getPlugins()).map((plugin) => {
        return plugin.beforeCreateRelease(dryRun);
    }));
    if (checks.includes(false)) {
        log(chalk.white('Release Prevented by plugin'));
    }
    // (changelog, version bump, git commit)
    try {
        const releaseCreated = await executeSemanticRelease(dryRun);
        if (releaseCreated) {
            await Promise.all((await getPlugins()).map((plugin) => {
                return plugin.afterCreateRelease(dryRun);
            }));
            log(chalk.greenBright('Finished'));
            process.exit();
        }
    }
    catch (error) {
        console.error(error);
        log('Failed');
        process.exit(1);
    }
    log('Finished');
    process.exit(0);
}
//# sourceMappingURL=create.js.map
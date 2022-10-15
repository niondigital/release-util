import shell from 'shelljs';
import chalk from 'chalk';
import Plugin from '../base/Plugin';
/* eslint-disable @typescript-eslint/no-unused-vars */
export default class NetlifyPlugin extends Plugin {
    getName() {
        return 'niondigital-release-netlify';
    }
    init(rootProgram) {
        this.log('Plugin initialized');
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
    async beforeCreateRelease(dryRun) {
        // only operate in Netlify build context
        if (!process.env.NETLIFY || !process.env.BRANCH || !process.env.COMMIT_REF) {
            this.log(chalk.yellow('Operating outside Netlify build context. Skipping Netlify Git setup handling.'));
            return true;
        }
        this.log(chalk.gray('Netlify build context detected. Verifying local copy'));
        // working dir branch = branch reported by git (in Netlify this will be a commit, not a branch)
        const workdirBranch = shell
            .exec('git rev-parse --abbrev-ref HEAD', { silent: true })
            .toString()
            .replace(/([\n\r])/, '');
        // build branch as provided in env by Netlify, working dir branch as a fallback (= working dir is on a real branch)
        const buildBranch = process.env.BRANCH || workdirBranch;
        // ! Kids, don't try this at home - this will meddle with your local git repo!
        if (workdirBranch !== buildBranch) {
            this.log(chalk.white(`Netlify reported build branch '${buildBranch}', but local copy is '${workdirBranch}'. Checking out build branch...`));
            // env.BRANCH is different from what Git reports as being the current branch
            shell.exec(`git branch -f ${buildBranch} ${process.env.COMMIT_REF}`, { silent: true });
            shell.exec(`git checkout ${buildBranch}`, { silent: true });
        }
        this.log(chalk.greenBright(`Local branch is '${buildBranch}'.`));
        return true;
    }
    /**
     * Notify Sentry of the new release so issues can be linked with releases
     * and commit suggestions can be made
     */
    async afterCreateRelease(dryRun) {
        //
    }
    /**
     * Notify Sentry of a deployment of a release
     */
    async afterDeploymentFinished() {
        //
    }
    log(message) {
        console.log(`${chalk.gray(`[${this.getName()}]`)} ${message}`);
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
//# sourceMappingURL=netlify-plugin.js.map
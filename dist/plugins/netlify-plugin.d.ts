import Plugin from '../base/Plugin';
import * as program from 'commander';
export default class NetlifyPlugin extends Plugin {
    getName(): string;
    init(program: program.Command): void;
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
    beforeCreateRelease(dryRun: boolean): Promise<boolean>;
    /**
     * Notify Sentry of the new release so issues can be linked with releases
     * and commit suggestions can be made
     */
    afterCreateRelease(dryRun: boolean): Promise<void>;
    /**
     * Notify Sentry of a deployment of a release
     */
    afterDeploymentFinished(): Promise<void>;
    private log;
}

import * as program from 'commander';
import Plugin from '../base/Plugin';
export default class DatadogPlugin extends Plugin {
    getName(): string;
    init(rootProgram: program.Command): void;
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
    private static isDatadogEnabled;
    private log;
}

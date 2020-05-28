import Plugin from '../base/Plugin';
export default class SentryPlugin extends Plugin {
    getName(): string;
    init(): void;
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
    private isSentryEnabled;
}

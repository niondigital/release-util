import Plugin from '../base/Plugin';
export default class SentryPlugin extends Plugin {
    getName(): string;
    init(): void;
    beforeRelease(dryRun: boolean): Promise<boolean>;
    /**
     * Notify Sentry of the new release so issues can be linked with releases
     * and commit suggestions can be made
     */
    afterRelease(dryRun: boolean): Promise<void>;
    /**
     * Notify Sentry of a deployment of a release
     */
    onDeploymentComplete(): Promise<void>;
    private isSentryEnabled;
}

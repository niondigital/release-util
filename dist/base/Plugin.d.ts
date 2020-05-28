export default abstract class Plugin {
    abstract getName(): string;
    abstract init(): void;
    abstract beforeRelease(dryRun: boolean): Promise<boolean>;
    abstract afterRelease(dryRun: boolean): Promise<void>;
    abstract onDeploymentComplete(): Promise<void>;
}

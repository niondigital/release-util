/* eslint-disable @typescript-eslint/no-unused-vars */
export default abstract class Plugin {
	public abstract getName(): string;

	public abstract init(): void;

	public abstract async beforeRelease(dryRun: boolean): Promise<boolean>;

	public abstract async afterRelease(dryRun: boolean): Promise<void>;

	public abstract async onDeploymentComplete(): Promise<void>;
}

/* eslint-enable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */
export default abstract class Plugin {
	public abstract getName(): string;

	public abstract init(): void;

	public abstract async beforeCreateRelease(dryRun: boolean): Promise<boolean>;

	public abstract async afterCreateRelease(dryRun: boolean): Promise<void>;

	public abstract async afterDeploymentFinished(): Promise<void>;
}

/* eslint-enable @typescript-eslint/no-unused-vars */

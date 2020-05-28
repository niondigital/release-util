/* eslint-disable @typescript-eslint/no-unused-vars */
import * as program from 'commander';

export default abstract class Plugin {
	public abstract getName(): string;

	public abstract init(program: program.Command): void;

	public abstract async beforeCreateRelease(dryRun: boolean): Promise<boolean>;

	public abstract async afterCreateRelease(dryRun: boolean): Promise<void>;

	public abstract async afterDeploymentFinished(): Promise<void>;
}

/* eslint-enable @typescript-eslint/no-unused-vars */

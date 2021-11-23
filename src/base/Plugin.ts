/* eslint-disable @typescript-eslint/no-unused-vars */
import * as program from 'commander';

export default abstract class Plugin {
	public abstract getName(): string;

	public abstract init(program: program.Command): void;

	public abstract beforeCreateRelease(dryRun: boolean): Promise<boolean>;

	public abstract afterCreateRelease(dryRun: boolean): Promise<void>;

	public abstract afterDeploymentFinished(): Promise<void>;
}

/* eslint-enable @typescript-eslint/no-unused-vars */

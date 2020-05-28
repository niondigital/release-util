import * as program from 'commander';
export default abstract class Plugin {
    abstract getName(): string;
    abstract init(program: program.Command): void;
    abstract beforeCreateRelease(dryRun: boolean): Promise<boolean>;
    abstract afterCreateRelease(dryRun: boolean): Promise<void>;
    abstract afterDeploymentFinished(): Promise<void>;
}

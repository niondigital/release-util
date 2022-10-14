import * as shell from 'shelljs';
import inquirer from 'inquirer';
import chalk from 'chalk';

function log(message: string): void {
	console.log(`${chalk.gray('[createDeployment]')} ${message}`);
}

function getDeploymentBranches(): string[] {
	if (!process.env.DEPLOYMENT_BRANCHES) {
		throw new Error(
			'Please specify a comma-separated list of deployment branches via environment variable DEPLOYMENT_BRANCHES'
		);
	}
	return process.env.DEPLOYMENT_BRANCHES.split(',').map((branch: string): string => branch.trim());
}

export default async function createDeployment(): Promise<void> {
	const deploymentBranches: string[] = getDeploymentBranches();

	console.log(
		`\n${chalk.red(
			'Attention:\n'
		)} - This command operates on multiple branches - consider commiting local changes first.\n - Make sure branches ${deploymentBranches.join(
			', '
		)} exist locally and are set to follow to their origin/x counterparts.\n`
	);

	shell.exec('git fetch --all', { silent: true });

	const gitTagOutput: shell.ShellString = shell.exec(
		"git tag -l --sort=-v:refname --format='%(refname:short)|%(creatordate)'",
		{ silent: true }
	);

	const releaseTagChoices: any[] = gitTagOutput.stdout
		.split('\n')
		.filter((tagString: string): boolean => !!tagString)
		.map((tagString: string): any => {
			const [tagName, creatorDate] = tagString.split('|');
			const creatorDateObject: Date = new Date(creatorDate);
			return {
				value: tagName,
				short: tagName,
				name: `${tagName.padEnd(12, ' ')}   (${creatorDateObject.getDate()}.${
					creatorDateObject.getMonth() + 1
				}.${creatorDateObject.getFullYear()})`
			};
		});

	if (releaseTagChoices.length === 0) {
		log(chalk.red('Error: No release exist that could be deployed.'));
		return;
	}

	const { deployBranchName } = await inquirer.prompt([
		{
			type: 'list',
			name: 'deployBranchName',
			message: 'Choose branch/environment to deploy to',
			choices: deploymentBranches
		}
	]);

	const { tagName } = await inquirer.prompt([
		{
			type: 'list',
			name: 'tagName',
			message: 'Choose release to deploy into the selected deployment branch',
			choices: releaseTagChoices
		}
	]);

	let { stdout: currentBranchName } = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true });
	currentBranchName = currentBranchName.replace('\n', '');

	const statusResult: shell.ShellString = shell.exec('git status --porcelain');
	const hasLocalChanges: boolean = statusResult.stdout.split('\n').length > 1;

	if (hasLocalChanges) {
		log('Stashing local changes...');
		shell.exec('git stash');
	}

	log(`Checking out branch '${deployBranchName}'...`);
	shell.exec(`git checkout ${deployBranchName}`);

	log(`Resetting branch to '${tagName}'...`);
	shell.exec(`git reset --hard ${tagName}`);

	log('Performing force push...');
	shell.exec('git push --force');

	if (deployBranchName !== currentBranchName) {
		log(`Checking out branch '${currentBranchName}'...`);
		shell.exec(`git checkout ${currentBranchName}`);
		if (hasLocalChanges) {
			log('Applying previously stashed local changes...');
			shell.exec('git stash pop');
		}
	}

	log(chalk.greenBright('Finished'));
}

import Plugin from '../../base/Plugin';
import getPlugins from '../../base/getPlugins';
import chalk from 'chalk';

function log(message: string): void {
	console.log(`${chalk.gray('[finishDeployment]')} ${message}`);
}

export default async function finishDeployment(): Promise<void> {
	await Promise.all(
		(await getPlugins()).map(
			(plugin: Plugin): Promise<void> => {
				return plugin.afterDeploymentFinished();
			}
		)
	);

	log(chalk.greenBright('Finished'));
}

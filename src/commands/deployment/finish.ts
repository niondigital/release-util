import Plugin from '../../base/Plugin';
import getPlugins from '../../base/getPlugins';

export default async function finishDeployment(): Promise<void> {
	await Promise.all(
		(await getPlugins()).map(
			(plugin: Plugin): Promise<void> => {
				return plugin.afterDeploymentFinished();
			}
		)
	);

	console.log('[complete-deployment] Finished');
}

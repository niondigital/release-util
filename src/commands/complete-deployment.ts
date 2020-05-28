import Plugin from '../base/Plugin';
import getPlugins from '../base/getPlugins';

export async function completeDeployment(): Promise<void> {
	await Promise.all(
		getPlugins().map(
			(plugin: Plugin): Promise<void> => {
				return plugin.onDeploymentComplete();
			}
		)
	);

	console.log('[complete-deployment] Finished');
}

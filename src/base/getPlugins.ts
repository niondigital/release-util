import {resolve} from 'path';
import appRoot from 'app-root-path';
import Plugin from './Plugin';

export default async function getPlugins(): Promise<Plugin[]> {
	const plugins: Plugin[] = [];
	const releasePlugins: string | undefined = process.env.RELEASE_PLUGINS;

	if (releasePlugins) {
		await Promise.all(
			releasePlugins.split(',').map(async (pluginName: string): Promise<void> => {
				let pluginModule: any;
				try {
					pluginModule = await import(pluginName); // eslint-disable-line @typescript-eslint/no-var-requires
				} catch (error) {
					try {
						pluginModule = await import(resolve(String(appRoot), pluginName)); // eslint-disable-line @typescript-eslint/no-var-requires
					} catch (error2) {
						//
					}
				}
				if (!pluginModule) throw new Error(`Could not load plugin '${pluginName}'`);

				// eslint-disable-next-line new-cap
				const pluginInstance: any = new pluginModule.default();

				if (!(pluginInstance instanceof Plugin)) {
					throw new Error(`Not a plugin module: '${pluginName}'`);
				}

				plugins.push(pluginInstance);
			})
		);
	}

	return plugins;
}

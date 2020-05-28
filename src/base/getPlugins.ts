import SentryPlugin from '../plugins/SentryPlugin';
import Plugin from './Plugin';

export default function getPlugins(): Plugin[] {
	const plugins: Plugin[] = [new SentryPlugin()];
	const releasePlugins: string | undefined = process.env.RELEASE_PLUGINS;

	if (releasePlugins) {
		releasePlugins.split('.').forEach((pluginName: string): void => {
			plugins.push(require(pluginName)); // eslint-disable-line @typescript-eslint/no-var-requires
		});
	}

	return plugins;
}

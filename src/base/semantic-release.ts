import {existsSync} from 'fs';
import appRoot from 'app-root-path';
import semanticRelease from 'semantic-release';
// @ts-ignore
import * as configBase from '../../release.config.base.cjs';

async function getSemanticReleaseOptions(): Promise<semanticRelease.Options> {
	// eslint-disable-next-line global-require,import/no-dynamic-require
	const baseOptions: semanticRelease.Options = configBase.default
	let localOptionsFilename: string = `${appRoot}/release.config.cjs`;

	if (existsSync(localOptionsFilename)) {
		const localOptions: semanticRelease.Options = await import(localOptionsFilename);
		return { ...baseOptions, ...localOptions };
	}

	localOptionsFilename = `${appRoot}/release.config.js`;

	if (existsSync(localOptionsFilename)) {
		const localOptions: semanticRelease.Options = await import(localOptionsFilename);
		return { ...baseOptions, ...localOptions };
	}

	return baseOptions;
}

export { getSemanticReleaseOptions };

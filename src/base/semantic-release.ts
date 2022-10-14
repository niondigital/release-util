import * as fs from 'fs';
import appRoot from 'app-root-path';
import semanticRelease from 'semantic-release';
// @ts-ignore
import * as configBase from '../../release.config.base.cjs';

function getSemanticReleaseOptions(): semanticRelease.Options {
	// eslint-disable-next-line global-require,import/no-dynamic-require
	const baseOptions: semanticRelease.Options = configBase.default
	const localOptionsFilename: string = `${appRoot}/release.config.js`;

	return fs.existsSync(localOptionsFilename) ? {} : baseOptions;
}

export { getSemanticReleaseOptions };

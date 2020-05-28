import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import * as semanticRelease from 'semantic-release';

function getSemanticReleaseOptions(): semanticRelease.Options {
	const baseOptions: semanticRelease.Options = require(path.resolve(__dirname, '../../release.config.base.js')); // eslint-disable-line @typescript-eslint/no-var-requires
	const localOptionsFilename: string = `${appRoot}/release.config.js`;

	return fs.existsSync(localOptionsFilename) ? require(localOptionsFilename) : baseOptions;
}

export { getSemanticReleaseOptions };

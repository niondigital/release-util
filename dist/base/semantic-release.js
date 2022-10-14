import * as fs from 'fs';
import appRoot from 'app-root-path';
// @ts-ignore
import * as configBase from '../../release.config.base.cjs';
function getSemanticReleaseOptions() {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const baseOptions = configBase.default;
    const localOptionsFilename = `${appRoot}/release.config.js`;
    return fs.existsSync(localOptionsFilename) ? {} : baseOptions;
}
export { getSemanticReleaseOptions };
//# sourceMappingURL=semantic-release.js.map
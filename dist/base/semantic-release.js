import * as fs from 'fs';
import appRoot from 'app-root-path';
// @ts-ignore
import * as configBase from '../../release.config.base.cjs';
async function getSemanticReleaseOptions() {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const baseOptions = configBase.default;
    let localOptionsFilename = `${appRoot}/release.config.cjs`;
    if (fs.existsSync(localOptionsFilename)) {
        const localOptions = await import(localOptionsFilename);
        return { ...baseOptions, ...localOptions };
    }
    localOptionsFilename = `${appRoot}/release.config.js`;
    if (fs.existsSync(localOptionsFilename)) {
        const localOptions = await import(localOptionsFilename);
        return { ...baseOptions, ...localOptions };
    }
    return baseOptions;
}
export { getSemanticReleaseOptions };
//# sourceMappingURL=semantic-release.js.map
import shell from 'shelljs';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import Plugin from '../base/Plugin';
/* eslint-disable @typescript-eslint/no-unused-vars */
export default class DatadogPlugin extends Plugin {
    getName() {
        return 'niondigital-release-datadog';
    }
    init(rootProgram) {
        const sentryCommand = rootProgram.command('datadog').description('Datadog operations');
        sentryCommand
            .command('upload-sourcemaps')
            .description('Upload source maps to Datadog')
            .action(() => {
            this.afterCreateRelease(false).catch((error) => {
                console.error(error);
            });
        });
        this.log('Plugin initialized');
    }
    async beforeCreateRelease(dryRun) {
        return true;
    }
    /**
     * Notify Sentry of the new release so issues can be linked with releases
     * and commit suggestions can be made
     */
    async afterCreateRelease(dryRun) {
        if (dryRun)
            return;
        // only execute if sentry is enabled per environment config
        if (!DatadogPlugin.isDatadogEnabled()) {
            this.log(chalk.yellow('Environment variable DATADOG_ENABLED not set or explicitly disabling Datadog - skipping datadog release...'));
            return;
        }
        this.log(chalk.white('DataDog is enabled - uploading source maps...'));
        // use fresh version info from package.json instead of using process.env.npm_package_version as version was changed by semantic-release since app start
        const packageJson = JSON.parse(String(readFileSync(path.resolve(String(appRoot), './package.json'))));
        const currentVersion = packageJson.version;
        this.log(chalk.white(`Datadog release version: ${currentVersion}`));
        shell.env.DATADOG_API_KEY = process.env.DD_API_KEY ?? process.env.DATADOG_API_KEY;
        if (!shell.env.DATADOG_API_KEY) {
            throw new Error('Please set environment variable DD_API_KEY/DATADOG_API_KEY');
        }
        shell.env.DATADOG_SITE = process.env.DD_SITE ?? process.env.DATADOG_SITE;
        shell.env.DATADOG_API_HOST = process.env.DD_API_HOST ?? process.env.DATADOG_API_HOST;
        const sourceMaps = process.env.DD_SOURCEMAPS ?? process.env.DATADOG_SOURCEMAPS;
        // Upload source maps (if paths are provided)
        if (sourceMaps) {
            // multiple source map configs may be provided, separated by comma
            // each config must consist of a path and can optionally be prefixed  with options to pass to sentry-cli releases files ,
            // like `--ext js --ext ts --ext tsx --ext jsx --ext map`
            const sourceMapPaths = sourceMaps.split(',');
            sourceMapPaths.forEach((sourceMapPath) => {
                shell.exec(`datadog-ci sourcemaps upload ${sourceMapPath} --release-version '${currentVersion}'`, {
                    silent: false
                });
            });
        }
        this.log(chalk.greenBright('Datadog release completed'));
    }
    /**
     * Notify Sentry of a deployment of a release
     */
    async afterDeploymentFinished() {
        //
    }
    static isDatadogEnabled() {
        return !['false', '0', ''].includes(String(process.env.DATADOG_ENABLED).toLowerCase());
    }
    log(message) {
        console.log(`${chalk.gray(`[${this.getName()}]`)} ${message}`);
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
//# sourceMappingURL=datadog-plugin.js.map
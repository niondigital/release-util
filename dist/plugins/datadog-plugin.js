import * as shell from 'shelljs';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
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
        const packageJson = JSON.parse(String(fs.readFileSync(path.resolve(String(appRoot), './package.json'))));
        const currentVersion = packageJson.version;
        this.log(chalk.white(`Datadog release version: ${currentVersion}`));
        if (!process.env.DATADOG_API_KEY) {
            throw new Error('Please set environment variable DATADOG_API_KEY');
        }
        shell.env.DATADOG_API_KEY = process.env.DATADOG_API_KEY;
        if (process.env.DATADOG_SITE) {
            shell.env.DATADOG_SITE = process.env.DATADOG_SITE;
        }
        if (process.env.DATADOG_API_HOST) {
            shell.env.DATADOG_API_HOST = process.env.DATADOG_API_HOST;
        }
        // Upload source maps (if paths are provided)
        if (process.env.DATADOG_SOURCEMAPS) {
            // multiple source map configs may be provided, separated by comma
            // each config must consist of a path and can optionally be prefixed  with options to pass to sentry-cli releases files ,
            // like `--ext js --ext ts --ext tsx --ext jsx --ext map`
            const sourceMapPaths = (process.env.DATADOG_SOURCEMAPS || '').split(',');
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
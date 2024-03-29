import shell from 'shelljs';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import appRoot from 'app-root-path';
import Plugin from '../base/Plugin';
/* eslint-disable @typescript-eslint/no-unused-vars */
export default class SentryPlugin extends Plugin {
    getName() {
        return 'niondigital-release-sentry';
    }
    init(rootProgram) {
        const sentryCommand = rootProgram.command('sentry').description('Sentry operations');
        sentryCommand
            .command('create-deployment')
            .description('Notify sentry of a deployment')
            .action(() => {
            this.afterDeploymentFinished().catch((error) => {
                console.error(error);
            });
        });
        sentryCommand
            .command('create-release')
            .description('Notify sentry of a release')
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
        if (!SentryPlugin.isSentryEnabled()) {
            this.log(chalk.yellow('Environment variable SENTRY_ENABLED not set or explicitly disabling Sentry - skipping sentry release...'));
            return;
        }
        this.log(chalk.white('Sentry is enabled - starting Sentry release...'));
        // use fresh version info from package.json instead of using process.env.npm_package_version as version was changed by semantic-release since app start
        const packageJson = JSON.parse(String(readFileSync(resolve(String(appRoot), './package.json'))));
        const currentVersion = `${packageJson.name}@${packageJson.version}`;
        this.log(chalk.white(`Sentry release version: ${currentVersion}`));
        if (!process.env.SENTRY_AUTH_TOKEN) {
            throw new Error('Please set environment variable SENTRY_AUTH_TOKEN');
        }
        if (!process.env.SENTRY_DSN) {
            throw new Error('Please set environment variable SENTRY_DSN');
        }
        if (!process.env.SENTRY_ORG) {
            throw new Error('Please set environment variable SENTRY_ORG');
        }
        if (!process.env.SENTRY_PROJECT) {
            throw new Error('Please set environment variable SENTRY_PROJECT');
        }
        shell.env.SENTRY_DSN = process.env.SENTRY_DSN || '';
        shell.env.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
        shell.env.SENTRY_ORG = process.env.SENTRY_ORG || '';
        const sentryProject = process.env.SENTRY_PROJECT || '';
        // Create a Sentry release
        shell.exec(`sentry-cli releases new -p ${sentryProject} "${currentVersion}"`, { silent: false });
        // Upload source maps (if paths are provided)
        if (process.env.SENTRY_SOURCEMAPS) {
            // multiple source map configs may be provided, separated by comma
            // each config must consist of a path and can optionally be prefixed  with options to pass to sentry-cli releases files ,
            // like `--ext js --ext ts --ext tsx --ext jsx --ext map`
            const sourceMapPaths = (process.env.SENTRY_SOURCEMAPS || '').split(',');
            sourceMapPaths.forEach((sourceMapPath) => {
                shell.exec(`sentry-cli releases files "${currentVersion}" upload-sourcemaps ${sourceMapPath}`, {
                    silent: false
                });
            });
        }
        // finalize release
        shell.exec(`sentry-cli releases finalize "${currentVersion}"`, { silent: false });
        if (process.env.SENTRY_REPOSITORY_ID) {
            this.log('Associating commits with release...');
            // Associate latest commit with the release
            const releaseCommitRef = shell
                .exec('git log -1 --format="%H"', { silent: true })
                .toString()
                .replace(/([\n\r])/, '');
            shell.exec(`sentry-cli releases set-commits "${currentVersion}" --commit "${process.env.SENTRY_REPOSITORY_ID}@${releaseCommitRef}"`, { silent: false });
        }
        else {
            this.log(chalk.yellow('Environment variable SENTRY_REPOSITORY_ID not set - trying to auto-associate commits...'));
            shell.exec(`sentry-cli releases set-commits "${currentVersion}" --auto`, { silent: false });
        }
        this.log(chalk.greenBright('Sentry release completed'));
    }
    /**
     * Notify Sentry of a deployment of a release
     */
    async afterDeploymentFinished() {
        if (!SentryPlugin.isSentryEnabled()) {
            console.info('[finish-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...');
            return;
        }
        if (process.env.SENTRY_NOTIFY_OF_DEPLOYMENT !== '1') {
            console.info('[finish-deployment] Current branch is not configured to deploy a release in Sentry. Skipping sentry deployment notification...');
            return;
        }
        console.log(chalk.white('[complete-deployment] Notifying Sentry of release deployment...'));
        const packageJson = JSON.parse(String(readFileSync(resolve(String(appRoot), './package.json'))));
        const currentVersion = `${packageJson.name}@${packageJson.version}`;
        console.log(chalk.white(`[complete-deployment] Sentry release version to deploy: ${currentVersion}`));
        shell.env.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
        shell.env.SENTRY_ORG = process.env.SENTRY_ORG || '';
        // Notify of release deployment
        const url = process.env.SENTRY_DEPLOY_URL ? ` -u "${process.env.SENTRY_DEPLOY_URL}"` : '';
        shell.exec(`sentry-cli releases deploys "${currentVersion}" new -e "${process.env.SENTRY_ENVIRONMENT}"${url}`, { silent: false });
        if (process.env.SENTRY_REPOSITORY_ID) {
            // Associate latest commit with the release
            const releaseCommitRef = shell
                .exec('git log -1 --format="%H"', { silent: true })
                .toString()
                .replace(/(\[n|\r])/, '');
            shell.exec(`sentry-cli releases set-commits "${currentVersion}" --commit "${process.env.SENTRY_REPOSITORY_ID}@${releaseCommitRef}"`, { silent: false });
        }
        console.log(chalk.greenBright('[complete-deployment] Sentry release deployment completed'));
    }
    static isSentryEnabled() {
        return !['false', '0', ''].includes(String(process.env.SENTRY_ENABLED).toLowerCase());
    }
    log(message) {
        console.log(`${chalk.gray(`[${this.getName()}]`)} ${message}`);
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
//# sourceMappingURL=sentry-plugin.js.map
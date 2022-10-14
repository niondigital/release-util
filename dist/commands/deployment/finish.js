import getPlugins from '../../base/getPlugins';
import chalk from 'chalk';
function log(message) {
    console.log(`${chalk.gray('[finishDeployment]')} ${message}`);
}
export default async function finishDeployment() {
    await Promise.all((await getPlugins()).map((plugin) => {
        return plugin.afterDeploymentFinished();
    }));
    log(chalk.greenBright('Finished'));
}
//# sourceMappingURL=finish.js.map
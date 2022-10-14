const config = require('./release.config.base.cjs'); // eslint-disable-line @typescript-eslint/no-var-requires

config.npmPublish = true;
module.exports = config;

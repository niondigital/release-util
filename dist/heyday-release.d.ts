#!/usr/bin/env node
import '@seibert-io/heyday-env';
import { program } from 'commander';
import deploy from './commands/deploy';
import release from './commands/release';
import { completeDeployment } from './commands/complete-deployment';
export { release, deploy, completeDeployment, program as default };

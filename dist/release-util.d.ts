#!/usr/bin/env node
import '@niondigital/env-util';
import { program } from 'commander';
import createDeployment from './commands/deployment/create';
import createRelease from './commands/release/create';
import finishDeployment from './commands/deployment/finish';
export { createRelease, createDeployment, finishDeployment, program as default };

#!/usr/bin/env node
import '@seibert-io/heyday-env';
import { program } from 'commander';
import deploy from './commands/deploy';
import release from './commands/release';
export { deploy, release, program as default };

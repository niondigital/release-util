import pathModule from 'path';
import dotenv, { DotenvConfigOutput } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { existsSync } from 'fs';
import appRoot from 'app-root-path';
// TODO: extract env handling to own package?
const loadedEnvs: Map<string, DotenvConfigOutput> = new Map();

function loadEnvironment(path: string): void {
	if (!loadedEnvs.has(path)) {
		loadedEnvs.set(path, dotenvExpand(dotenv.config({ path })));
	}
}

const localEnvFile: string = pathModule.resolve(String(appRoot), './.env.local');

if (existsSync(localEnvFile)) {
	loadEnvironment(localEnvFile);
}

loadEnvironment(pathModule.resolve(String(appRoot), './.env'));

export { loadEnvironment };

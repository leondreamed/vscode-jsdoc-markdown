import path from 'node:path'
import { runTests } from '@vscode/test-electron';
import { join } from 'desm'

const extensionDevelopmentPath = join(import.meta.url, '..');
const extensionTestsPath = join(import.meta.url, '../test/index.js');

await runTests({
	extensionDevelopmentPath,
	extensionTestsPath,
});

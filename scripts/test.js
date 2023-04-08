const path = require('node:path')
const { runTests } = require('@vscode/test-electron');

const extensionDevelopmentPath = path.resolve(__dirname, '..');
const extensionTestsPath = path.resolve(__dirname, './test');

runTests({
	extensionDevelopmentPath,
	extensionTestsPath,
});

const fs = require('fs');
const path = require('path');

const cliProgress = require('cli-progress');
const commandLineArgs = require('command-line-args');
const chalk = require('chalk');

const options = commandLineArgs([
  { name: 'output', alias: 'o', type: String },
  { name: 'version', alias: 'v', type: String },
  { name: 'help', alias: 'h', type: Boolean },
]);

const config = {
  apiUrl: 'https://changelogs-live.fivem.net/api/changelog',
  os: process.platform == 'win32' ? 'win32' : 'linux',
  outDir: path.resolve(options.output || 'fivem'),
  version: options.version || 'latest',
};

if (options.help) {
  console.log('Usage: fivem-pkg [options]');
  console.log('Options:');
  console.log('  -o, --output <dir>   Output directory (default: fivem)');
  console.log('  -v, --version <ver>  Version to download (default: latest)');
  process.exit(0);
}

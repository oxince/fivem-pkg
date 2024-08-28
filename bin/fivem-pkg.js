const fs = require('node:fs');
const path = require('node:path');
const stream = require('node:stream');
const { promisify } = require('node:util');
const pipeline = promisify(stream.pipeline);

const cliProgress = require('cli-progress');
const commandLineArgs = require('command-line-args');
const chalk = require('chalk');

const log = (...args) => console.log(chalk.yellow('fivem-pkg:'), ...args);

const options = commandLineArgs([
  { name: 'output', alias: 'o', type: String },
  { name: 'version', alias: 'v', type: String },
  { name: 'help', alias: 'h', type: Boolean },
]);

const config = {
  apiUrl: 'https://changelogs-live.fivem.net/api/changelog',
  os: process.platform == 'win32' ? 'win32' : 'linux',
  outDir: path.resolve(options.output || 'artifacts'),
  branch: options.branch || 'latest',
};

const fileName = config.os === 'win32' ? 'server.7z' : 'fx.tar.xz';

if (options.help) {
  console.log(`Usage: ${chalk.yellow('fivem-pkg')} [options]`);
  console.log('Options:');
  console.log('  -o, --output <dir>   Output directory (default: fivem)');
  console.log('  -b, --branch <ver>  Branch to download (options: recommended, optional, latest)');
  process.exit(0);
}

const download = async (url, out) => {
  const response = await fetch(url).catch((err) => {
    console.error(err);
    console.log('Sorry, there was an error downloading the artifact. Please wait a moment and try again.');
    process.exit(1);
  });

  if (!response.ok) {
    console.error(`Failed to fetch ${url}: ${response.statusText}`);
    process.exit(1);
  }

  const total = parseInt(response.headers.get('content-length'), 10);
  const progressBar = new cliProgress.SingleBar({
    format: `${chalk.yellow('[{bar}]')} {percentage}% | ETA: {eta_formatted}`,
  });
  progressBar.start(total, 0);

  let downloaded = 0;

  await pipeline(
    response.body,
    new stream.Transform({
      transform(chunk, encoding, callback) {
        downloaded += chunk.length;
        progressBar.update(downloaded);
        callback(null, chunk);
      },
    }),
    fs.createWriteStream(out)
  );

  progressBar.stop();
};

async function unzipFile(file) {
  if (file.endsWith('.7z')) {
    const streamZip = require('node-stream-zip');
    const zip = new streamZip.async({
      file: path.join(config.outDir, file),
    });
    zip.on('error', (err) => {
      log('An error occurred while extracting the artifact:', err);
      process.exit(1);
    });
    await zip.extract(null, config.outDir);
    await zip.close();
  } else {
    const childProcess = require('child_process');
    const command = `tar xf ${path.join(config.outDir, file)} -C ${config.outDir}`;
    childProcess.execSync(command);
  }
}

const mkdirFilePath = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  } else {
    fs.rmSync(path, { recursive: true, force: true }, (err) => {
      if (err) {
        log('An error occurred while deleting the old artifact:', err);
        process.exit(1);
      }
    });
    fs.mkdirSync(path, { recursive: true });
  }
};

const start = async () => {
  const started = Date.now();

  mkdirFilePath(config.outDir);
  log(`Fetching FiveM Artifact branch ${config.branch}`);

  const versions = await fetch(`${config.apiUrl}/versions/${config.os}/server`)
    .then((res) => res.json())
    .catch((err) => {
      log('Sorry, there was an error fetching the version list. Please wait a moment and try again.');
      process.exit(1);
    });

  const version = versions[config.branch];
  if (!version) {
    log(`Sorry, the branch you requested (${config.branch}) is not available.`);
    process.exit(1);
  }

  log(`Downloading version ${version}...`);

  const url = versions[`${config.branch}_download`];
  await download(url, path.join(config.outDir, fileName));

  log('Extracting artifact...');
  await unzipFile(fileName);

  fs.unlinkSync(path.join(config.outDir, fileName));

  log(`Artifact downloaded & extracted in ${Date.now() - started}ms`);
};

start();

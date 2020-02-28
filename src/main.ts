const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const Configstore = require('configstore');

import files from './components/files';
import github from './components/github';

const conf = new Configstore('ginit');

clear();

console.log(chalk.yellow(figlet.textSync('Ginit', { horizontalLayout: 'full' })));

function printRed(msg: string | object): void {
  console.log(chalk.red(msg));
}

function printGreen(msg: string | object): void {
  if (typeof msg === 'object') console.log(chalk.green(msg.toString()));
  else console.log(chalk.green(msg));
}

if (files.directoryExists('.git')) {
  printRed('We already have a git repo association with this directory!');
  process.exit();
}

async function run(): Promise<void> {
  let token = github.getStoredGithubToken();
  if (!token) {
    token = (await github.getPersonalAccessToken()) as any;
  }
  console.log(token);
}

run();

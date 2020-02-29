#!/usr/bin/env node
import chalk = require('chalk');
import clear = require('clear');
import figlet = require('figlet');
import Configstore = require('configstore');

import repo from './components/repo';
import files from './components/files';
import github from './components/github';

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

async function getGithubToken(): Promise<{}> {
  // Fetch token from config store
  let token = github.getStoredGithubToken();
  if (token) {
    printRed("Existing Token:" + token)
    return token;
  }

  // No token found, use credentials to access GitHub account
  token = await github.getPersonalAccessToken();

  return token;
};

export async function run(): Promise<void> {
  try {
    // Retrieve & Set Authentication Token
    const token = await getGithubToken();
    printGreen("Token returned from getGithubToken:" + token)
    github.githubAuth(token);

    // Create remote repository
    const url = await repo.createRemoteRepo();

    // Create .gitignore file
    await repo.createGitignore();

    // Set up local repository and push to remote
    await repo.setupRepo(url);

    printGreen('All done!');
  } catch (err) {
    if (err) {
      switch (err.status) {
        case 401:
          printRed('Couldn\'t log you in. Please provide correct credentials/token.');
          break;
        case 422:
          printRed('There is already a remote repository or token with the same name');
          break;
        default:
          printRed(err);
      }
    }
  }
}

run();

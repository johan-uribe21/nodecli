import CLI = require('clui');
import fs = require('fs');
import simpleGit = require('simple-git/promise');
import touch = require('touch');
import _ = require('lodash');

import inquirer from './inquirer';
import gh from './github';
import { RepoDetails } from '../types/index';

const Spinner = CLI.Spinner;
const git = simpleGit()

async function createRemoteRepo() {
  const github = gh.getInstance();
  const answers = await inquirer.askRepoDetails();

  const data: RepoDetails = {
    name: answers.name as string,
    description: answers.description as string,
    private: answers.visibility === 'private',
  };

  const status = new Spinner('Creating remove repository...');
  status.start();

  try {
    const response = await github.repos.createForAuthenticatedUser(data);
    return response.data.ssh_url;
  } finally {
    status.stop();
  }
}

async function createGitignore () {
  const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

  if (filelist.length) {
    const answers = await inquirer.askIgnoreFiles(filelist);

    if (answers.ignore.length) {
      fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) );
    } else {
      touch( '.gitignore' );
    }
  } else {
    touch('.gitignore');
  }
}

async function setupRepo(url): Promise<void> {
  const status = new Spinner('Initializing local repository and pushing to remote...');
  status.start();

  try {
    git.init()
      .then(() => git.add('.gitignore'))
      .then(() => git.add('./*'))
      .then(() => git.commit('Initial commit'))
      .then(() => git.addRemote('origin', url))
      .then(() => git.push('origin', 'master'));
  } catch(e){
    console.log("Seting up git repo failed with error:", e)
    throw new Error("Seting up git repo failed with error:" + e)
  } finally {
    status.stop();
  }
}

export default { createRemoteRepo, createGitignore, setupRepo };

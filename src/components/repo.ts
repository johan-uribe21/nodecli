const CLI = require('clui');
const fs = require('fs');
const git = require('simple-git/promise');
const touch = require('touch');
const _ = require('lodash');

import inquirer from './inquirer';
import gh from './github';

const Spinner = CLI.Spinner;

async function createRemoteRepo() {
  const github = gh.getInstance();
  const answers = await inquirer.askRepoDetails();

  const data = {
    name: answers[0].name,
    description: answers[0].description,
    private: answers[0].visibility === 'private',
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

export default { createRemoteRepo };

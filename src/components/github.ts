const CLI = require('clui');
const Configstore = require('configstore');
const { Octokit } = require('@octokit/rest');

import { createBasicAuth } from '@octokit/auth-basic';
import inquirer from './inquirer.js';

const Spinner = CLI.Spinner;
// import pkg from './../package.json';
// import { BasicAuthInterface } from '../types';

const conf = new Configstore('ginit');

const octokit = new Octokit();

function getInstance(): any {
  return octokit;
}

function getStoredGithubToken(): string {
  return conf.get('github.token');
}

async function getPersonalAccessToken() {
  const credentials = await inquirer.askGithubCredentials();
  const status = new Spinner('Authentication you, please wait...');

  status.start();

  const auth = createBasicAuth({
    username: credentials.username as string,
    password: credentials.password as string,
    async on2Fa(): Promise<string> {
      status.stop();
      const res = await inquirer.getTwoFactorAuthenticationCode();
      status.start();
      return res.twoFactorAuthenticationCode;
    },
    token: {
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'ginit, the command-line tool for initializing Git repos',
    },
  });

  try {
    const tokenAuthentication = await auth({
      type: 'token',
    });

    if (tokenAuthentication) {
      console.log('tokenAuthentication: ', tokenAuthentication);
      conf.set('github.token', tokenAuthentication);
      return tokenAuthentication;
    } else {
      throw new Error('Github token was not found in the response');
    }
  } finally {
    status.stop;
  }
}

export default {
  getInstance,
  getStoredGithubToken,
  getPersonalAccessToken,
};

import CLI = require('clui');
import Configstore = require('configstore');
import Octokit = require('@octokit/rest');

import { createBasicAuth } from '@octokit/auth-basic';
import inquirer from './inquirer.js';
import files from './files'

const Spinner = CLI.Spinner;
// import pkg from './../package.json';
// import { BasicAuthInterface } from '../types';

const conf = new Configstore(files.getCurrentDirectoryBase());

let octokit = new Octokit.Octokit();

function getInstance(): any {
  return octokit;
}

function getStoredGithubToken(): string {
  return conf.get('github.token');
}

async function getPersonalAccessToken(): Promise<string | any> {
  const credentials = await inquirer.askGithubCredentials();
  const status = new Spinner('Authentication you, please wait...');

  status.start();

  const auth = createBasicAuth({
    username: credentials.username as string,
    password: credentials.password as string,
    async on2Fa(): Promise<string | any> {
      try {
        const res = await inquirer.getTwoFactorAuthenticationCode();
        return res.twoFactorAuthenticationCode;
      } catch (e) {
        console.log("Failed in on2FA block with error:", e)
      }
    },
    token: {
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'ginit, the command-line tool for initializing Git repos',
    },
  });

  try {
    console.log("Made it into the try block with creds:", credentials)
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
  } catch (e) {
    console.log("Fetching Github token failed with error:", e)
  } finally {
    status.stop();
  }
}

function githubAuth(token): void {
  console.log("GithubAUth function token", token)
  octokit = new Octokit.Octokit({
    auth: token
  });
}

export default {
  getInstance,
  getStoredGithubToken,
  getPersonalAccessToken,
  githubAuth
};

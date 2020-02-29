import inquirer = require('inquirer');
import minimist = require('minimist');

import files from './files.js';
import { Questions } from '../types';

function askGithubCredentials() {
  const Questions: [Questions, Questions] = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your Github username or email address:',
      validate: function(value: string): boolean | string {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your username or e-mail address.';
        }
      },
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password',
      validate: function(value: string): boolean | string {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password.';
        }
      },
    },
  ];
  return inquirer.prompt(Questions);
}

function getTwoFactorAuthenticationCode() {
  return inquirer.prompt({
    name: 'twoFactorAuthenticationCode',
    type: 'input',
    message: 'Enter your two-factor authentication code',
    validate: function(value: string): string | boolean {
      if (value.length) {
        return true;
      } else {
        return 'Please enter your two-factor authentication code.';
      }
    },
  });
}

function askIgnoreFiles(filelist): any {
  const questions = [
    {
      type: 'checkbox',
      name: 'ignore',
      message: 'Select the files and/or folders you wish to ignore:',
      choices: filelist,
      default: ['node_modules', 'bower_components']
    }
  ];
  return inquirer.prompt(questions);
}

function askRepoDetails() {
  const argv = minimist(process.argv.slice(2));

  const Questions: [Questions, Questions, Questions] = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter a name for the repository:',
      default: argv._[0] || files.getCurrentDirectoryBase(),
      validate: function(value: string): boolean | string {
        if (value.length) {
          return value;
        } else {
          return 'Please enter a name for the repository';
        }
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Optional: enter a description for the repository:',
      default: argv._[0] || null,
    },
    {
      type: 'list',
      name: 'visibility',
      message: 'Public or private?',
      choices: ['public', 'private'],
      default: 'public',
    },
  ];
  return inquirer.prompt(Questions);
}

export default {
  askRepoDetails,
  getTwoFactorAuthenticationCode,
  askGithubCredentials,
  askIgnoreFiles,
};

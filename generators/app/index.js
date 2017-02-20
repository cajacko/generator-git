const Generator = require('yeoman-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'origin',
      message: 'A git url origin e.g. github',
      default: 'https://github.com/username/new-project.git'
    }, {
      type: 'confirm',
      name: 'gitflow',
      message: 'Would you like to use gitflow?'
    }]).then((answers) => {
      this.name = answers.name;
      this.origin = answers.origin;
      this.gitflow = answers.gitflow;
    });
  }

  initialiseGit() {
    const destinationPath = this.destinationPath();
    const path = `${destinationPath}/.git`;

    this.spawnCommandSync('git', ['init']);

    if (!fs.existsSync(path)) {
      throw new Error('Git does not exist in the path');
    }

    if (this.gitflow) {
      this.spawnCommandSync('git', [
        'flow',
        'init',
        '-f',
        '-d'
      ]);
    }

    this.spawnCommandSync('git', [
      'remote',
      'add',
      'origin',
      this.origin
    ]);
  }
};

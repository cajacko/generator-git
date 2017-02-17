const Generator = require('yeoman-generator');
const fs = require('fs');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'confirm',
      name: 'subdir',
      message: 'Would you like to create a directory for this repository?',
    }, {
      type: 'input',
      name: 'name',
      message: 'Your project name, used for the dir folder and npm title',
      default: 'new-project'
    }, {
      type: 'input',
      name: 'origin',
      message: 'A git url origin e.g. github',
      default: 'https://github.com/username/new-project.git'
    }, {
      type: 'confirm',
      name: 'gitflow',
      message: 'Would you like to use gitflow?',
    }]).then((answers) => {
      this.subdir = answers.subdir;
      this.name = answers.name;
      this.origin = answers.origin;
      this.gitflow = answers.gitflow;
    });
  }

  initialiseGit() {
    const destinationPath = this.destinationPath();
    let path;
    let gitDir;
    const gitCommad = [];

    if (this.subdir) {
      gitDir = `${destinationPath}/${this.name}`;
      gitCommad.push('-C', gitDir);
      path = `${destinationPath}/${this.name}/.git`;

      this.spawnCommandSync('git', gitCommad.push('init'));
    } else {
      path = `${destinationPath}/.git`;
    }

    if (!fs.existsSync(path)) {
      throw new Error('Git does not exist in the path');
    }

    if (this.gitflow) {
      this.spawnCommandSync('git', gitCommad.push(
        'flow',
        'init',
        '-f',
        '-d'
      ));
    }

    this.spawnCommandSync('git', gitCommad.push(
      'remote',
      'add',
      'origin',
      this.origin
    ));
  }
};

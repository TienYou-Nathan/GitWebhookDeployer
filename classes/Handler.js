require("dotenv").config();

const { exec } = require("child_process");

class Handler {
  constructor({ LocalPath, remotePath, branch, env }) {
    this.LocalPath = LocalPath;
    this.remotePath = remotePath;
    this.branch = branch;
    this.env = env;

    this.actions = [
      {
        name: "pullServerRepo",
        command: `ssh ${process.env.OVH_HOSTNAME} 'git -C ${this.remotePath} pull'`
      },
      {
        name: "checkoutToBranch",
        command: `git -C ${this.LocalPath} checkout ${this.branch}`
      },
      {
        name: "pullLocalRepo",
        command: `git -C ${this.LocalPath} pull`
      },
      {
        name: "installNPM",
        command: `npm i --prefix ${this.LocalPath}/laravel`
      },
      {
        name: "compileFiles",
        command: `npm run ${this.env} --prefix ${this.LocalPath}/laravel`
      },
      {
        name: "transferFiles",
        command: `scp -r ${this.LocalPath}/laravel/public ${process.env.OVH_HOSTNAME}:${this.remotePath}/laravel`
      }
    ];
  }
  /**
   *
   * @param {*} err
   * @param {*} stdout
   * @param {*} stderr
   * @param {*} callback
   * @param {*} message
   */
  executeCommand(error, stdout, stderr, i = 0) {
    console.log(this.actions[i].name);
    console.log(this.actions[i].command);
    console.log("starting command...");
    exec(this.actions[i].command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stdout) console.log(`stdout: ${stdout}`);
      if (stderr) console.error(`stderr: ${stderr}`);
      if (i + 1 < this.actions.length) {
        this.executeCommand(error, stdout, stderr, i + 1);
      }
    });
  }
  run() {
    this.executeCommand();
  }
}

module.exports = Handler;

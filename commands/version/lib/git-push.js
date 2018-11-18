"use strict";

const log = require("npmlog");
const childProcess = require("@lerna/child-process");

module.exports = gitPush;

function gitPush({ remote, branch, tags, followTags = true }, opts) {
  log.silly("gitPush", remote, branch);

  const args = ["push", "--no-verify"];

  if (tags) {
    args.push(`--tags`);
  } else if (followTags) {
    args.push(`--follow-tags`);
  }

  if (remote) {
    args.push(remote);
  }

  if (branch) {
    args.push(branch);
  }

  return childProcess.exec("git", args, opts);
}

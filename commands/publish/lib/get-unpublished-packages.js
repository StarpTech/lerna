"use strict";

const pacote = require("pacote");
const log = require("npmlog");
const pReduce = require("p-reduce");

module.exports = getUnpublishedPackages;

function getUnpublishedPackages(project, opts) {
  log.silly("getPackageVersions");

  let chain = Promise.resolve();

  const mapper = (unpublished, pkg) =>
    pacote.packument(`${pkg.name}`, Object.assign({}, opts)).then(
      packument => {
        if (packument.versions[pkg.version] === undefined) {
          unpublished.push(pkg);
        }

        return unpublished;
      },
      () => {
        log.warn("", "Unable to determine published versions, assuming unpublished.");
        return unpublished.concat([pkg]);
      }
    );

  chain = chain.then(() => project.getPackages());
  chain = chain.then(packages => pReduce(packages, mapper, []));

  return chain;
}

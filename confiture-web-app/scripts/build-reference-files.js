/**
 * This scripts generates a file containing every RGAA tests methodology based
 * on the https://github.com/DISIC/accessibilite.numerique.gouv.fr repository.
 *
 * The result file uses the JSON format and contains a mapping of test ids
 * (ex: "1.2.3") with the associated methodology in Markdown.
 */

/* eslint-disable */
const child_process = require("node:child_process");
const util = require("node:util");
const path = require("path");
const fs = require("fs").promises;
const referenceData = [
  {
    githubRepositoryName: "ReferentielAccessibiliteWeb",
    githubUrl:
      "https://github.com/accessibility-luxembourg/ReferentielAccessibiliteWeb",
    githubJsonDirectoryName: "json",
    srcRepositoryName: "raweb"
  },
  {
    githubRepositoryName: "ReferentielAccessibiliteMobile",
    githubUrl:
      "https://github.com/accessibility-luxembourg/ReferentielAccessibiliteMobile",
    githubJsonDirectoryName: "json",
    srcRepositoryName: "raam"
  },
  {
    githubRepositoryName: "accessibilite.numerique.gouv.fr",
    githubUrl: "https://github.com/DISIC/accessibilite.numerique.gouv.fr",
    githubJsonDirectoryName: "RGAA",
    srcRepositoryName: "rgaa"
  }
];

const exec = util.promisify(child_process.exec);

async function cloneRepository(referenceData) {
  await exec(`rm -rf ${referenceData.githubRepositoryName}`);
  await exec(`git clone ${referenceData.githubUrl}`);
}

async function generateFile(referenceData, jsonFileName) {
  const METHODOLOGIES_SOURCE = path.join(
    __dirname,
    "..",
    ".",
    referenceData.githubRepositoryName,
    referenceData.githubJsonDirectoryName,
    jsonFileName
  );

  const METHODOLOGIES_DESTINATION = path.join(
    __dirname,
    "..",
    ".",
    "src",
    referenceData.srcRepositoryName
  );
  await fs.cp(
    METHODOLOGIES_SOURCE,
    path.join(METHODOLOGIES_DESTINATION, jsonFileName)
  );
}

(async function main() {
  for (const reference of referenceData) {
    await cloneRepository(reference);
    await generateFile(reference, "methodologies.json");
    await generateFile(reference, "criteres.json");
  }
})();

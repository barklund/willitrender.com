const glob = require("glob");
const path = require("path");
const fs = require("fs");
const cp = require("child_process");

function getFolder(publicSub, targetName) {
  const targetPath = path.normalize(
    path.join(__dirname, "..", "public", publicSub, targetName)
  );
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
  return targetPath;
}

function build(sourceFolder) {
  const projectName = path.basename(sourceFolder);

  // First build to proper folder
  const buildPath = getFolder("builds", projectName);
  cp.execSync(`BUILD_PATH=${buildPath} npm run build`, { cwd: sourceFolder });

  // The archive to proper zip
  const archivePath = getFolder("zips", `${projectName}.zip`);
  const gitFolder = `packages/${projectName}/src/`;
  cp.execSync(`git archive -o ${archivePath} HEAD:${gitFolder}`, {
    cwd: sourceFolder,
  });

  console.log("Built", projectName);
}

const projects = glob.sync(path.join(__dirname, "..", "packages", "*"));
projects.forEach(build);

#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Get the latest tag from GitHub
function getLatestTag() {
  try {
    // Get the latest tag from git
    const latestTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    return latestTag.replace('v', ''); // Remove 'v' prefix
  } catch (error) {
    console.log('No tags found, using default version');
    return '0.0.5';
  }
}

// Update package.json version
function updatePackageVersion(newVersion) {
  const packagePath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log(`Updating version from ${packageJson.version} to ${newVersion}`);
  packageJson.version = newVersion;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ Package.json version updated successfully!');
}

// Main execution
const latestVersion = getLatestTag();
updatePackageVersion(latestVersion); 
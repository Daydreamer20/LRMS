const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const packages = [
  { name: 'express', version: '4.18.2' },
  { name: 'cors', version: '2.8.5' },
  { name: 'mongoose', version: '8.0.3' },
  { name: 'dotenv', version: '16.3.1' }
];

const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  fs.mkdirSync(nodeModulesPath);
}

async function downloadPackage(pkg) {
  const url = `https://registry.npmjs.org/${pkg.name}/-/${pkg.name}-${pkg.version}.tgz`;
  const targetDir = path.join(nodeModulesPath, pkg.name);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${pkg.name}`));
        return;
      }

      const targetFile = path.join(targetDir, 'package.tgz');
      const fileStream = fs.createWriteStream(targetFile);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        console.log(`Downloaded ${pkg.name}`);
        const tar = spawn('tar', ['-xzf', targetFile, '-C', targetDir, '--strip-components=1']);
        
        tar.on('close', (code) => {
          if (code === 0) {
            fs.unlinkSync(targetFile);
            console.log(`Extracted ${pkg.name}`);
            resolve();
          } else {
            reject(new Error(`Failed to extract ${pkg.name}`));
          }
        });
      });
    }).on('error', reject);
  });
}

async function installAll() {
  try {
    for (const pkg of packages) {
      console.log(`Installing ${pkg.name}@${pkg.version}...`);
      await downloadPackage(pkg);
    }
    console.log('All packages installed successfully');
  } catch (error) {
    console.error('Installation failed:', error);
  }
}

installAll(); 
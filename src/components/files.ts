import fs = require('fs');
import path = require('path');

function getCurrentDirectoryBase(): string {
  return path.basename(process.cwd());
}

function directoryExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export default { getCurrentDirectoryBase, directoryExists };

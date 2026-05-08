import fs from 'fs';
import path from 'path';

function findJsonFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        findJsonFiles(filePath, fileList);
      }
    } else if (filePath.endsWith('.json')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const jsonFiles = findJsonFiles('.');
jsonFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    JSON.parse(content);
  } catch (err: any) {
    console.log(`Invalid JSON in ${file}: ${err.message}`);
    // Print the content around the error position if possible
    if (err.message.includes('position')) {
      const pos = parseInt(err.message.match(/position (\d+)/)[1]);
      console.log('Context:', fs.readFileSync(file, 'utf8').substring(pos - 20, pos + 20));
    }
  }
});

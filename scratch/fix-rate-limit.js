const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src', 'app', 'api'));
let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;
  
  if (content.match(/(const|let|var)\s+\w+\s*=\s*(check(?:Strict|Standard|Relaxed|Auth)?RateLimit)/g)) {
    content = content.replace(/(const|let|var)\s+(\w+)\s*=\s*(check(?:Strict|Standard|Relaxed|Auth)?RateLimit)/g, '$1 $2 = await $3');
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Updated', file);
  }
}
console.log('Total files updated:', count);

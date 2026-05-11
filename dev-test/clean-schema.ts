import fs from 'fs';

let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Change provider
content = content.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');

// Remove @db.Uuid, @db.VarChar(n), @db.Date, @db.Text, etc.
// Keep the space around it
content = content.replace(/@db\.[a-zA-Z0-9()]+/g, '');

fs.writeFileSync('prisma/schema.prisma', content);
console.log('Cleaned schema.prisma for SQLite (Take 2)');

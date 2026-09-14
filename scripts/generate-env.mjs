import { writeFileSync } from 'node:fs';
const apiUrl = process.env.API_URL || 'http://localhost:3000/api';
writeFileSync('public/env.js', `window.__MEUPET_API_URL__=${JSON.stringify(apiUrl)};\n`);
console.log(`Generated public/env.js for ${apiUrl}`);

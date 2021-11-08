const { stdout } = process;
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const fs = require('fs');
const stream = fs.createReadStream(filePath, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => stdout.write(data));
stream.on('error', error => console.log('Error', error.message));

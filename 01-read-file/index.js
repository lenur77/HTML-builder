const fs = require('fs');
const path = require('path');

const data = path.resolve(__dirname, 'text.txt'); 
const reader = fs.createReadStream(data);
reader.on('data', (chunk) => {
  console.log(chunk.toString());
});

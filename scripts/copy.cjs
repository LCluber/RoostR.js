// const path = require('path');
const fs      = require('fs');

const mail    = 'http://roostrjs.lcluber.com';
const CRLF    = '\r\n';
const rel     = './';
const src     = `${rel}build/`;
const dest    = `${rel}dist/`; 
const files   = [
  {
    src:  `${rel}src/ts/roostr.d.ts`,
    dest: `${dest}roostr.d.ts`
  },
  {
    src:  `${src}roostr.iife.js`,
    dest: `${dest}roostr.iife.js`
  },
  {
    src:  `${src}roostr.iife.min.js`,
    dest: `${dest}roostr.iife.min.js`
  },
  {
    src:  `${src}roostr.js`,
    dest: `${dest}roostr.js`
  },
];

fs.mkdir(dest, { recursive: false },(err) => {
  if (err) throw err;
  fs.readFile(`${rel}LICENCE.md`, (err, license) => {
    if (err) throw err;
    for (const file of files) {
      fs.readFile(file.src, (err, fileContent) => {
        if (err) throw err;
        fs.writeFile(file.dest, `/*${CRLF}${license}${CRLF}${mail}${CRLF}*/${CRLF}${CRLF}${fileContent}`, (err) => {
          if (err) throw err;
        });
      });
    }
  });
});

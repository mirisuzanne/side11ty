'use strict';

const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');

const novelDir = './src/novel/';

const parse = (file, dir) => {
  const content = fs.readFileSync(file, 'utf8', (err, data) => {
    if (err) throw err;
    return data;
  });
  const relative = path.relative(dir, file);
  const cards = content.split('<!-- slide -->').map((part) => matter(part.trimStart()));
  const meta = cards.shift();
  return {
    cards,
    file: relative,
    data: meta.data,
    content: meta.content,
    fileName: relative.split('/', 1)[0],
    slug: file.slice(file.lastIndexOf('/') + 1, file.lastIndexOf('.')),
  }
}

const walk = (dir, done) => {
  let results = [];

  fs.readdir(dir, (err, list) => {
    if (err) return done(err);

    let pending = list.length;
    if (!pending) return done(null, results);

    list.forEach((file) => {
      let theFile = path.resolve(dir, file);

      fs.stat(theFile, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(theFile, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (theFile.endsWith('.md')) results.push(parse(theFile, dir));
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

module.exports = async () =>
  new Promise((resolve, reject) => {
    walk(novelDir, function(err, results) {
      if (err) reject(err);
      resolve(results);
    });
  });

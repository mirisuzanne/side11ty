'use strict';

const path = require('path');
const fs = require('fs');

const chalk = require('chalk');
const matter = require('gray-matter');

const novelDir = './src/novel/';

const parse = (file, dir) => {
  // eslint-disable-next-line no-sync
  const content = fs.readFileSync(file, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    return data;
  });
  const relative = path.relative(dir, file);
  const cards = content
    .split('<!-- slide -->')
    .map((part) => matter(part.trimStart()));
  const meta = cards.shift();
  return {
    cards,
    file: relative,
    data: meta.data,
    content: meta.content,
    fileName: relative.split('/', 1)[0],
    slug: file.slice(file.lastIndexOf('/') + 1, file.lastIndexOf('.')),
  };
};

const walk = (dir, done) => {
  let results = [];

  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err);
    }

    let pending = list.length;
    if (!pending) {
      return done(null, results);
    }

    list.forEach((file) => {
      const theFile = path.resolve(dir, file);

      fs.stat(theFile, (err2, stat) => {
        if (err2) {
          // eslint-disable-next-line no-console
          console.error(chalk.red(err2));
        }
        if (stat && stat.isDirectory()) {
          walk(theFile, (err3, res) => {
            if (err3) {
              // eslint-disable-next-line no-console
              console.error(chalk.red(err2));
            }
            results = results.concat(res);
            pending = pending - 1;
            if (!pending) {
              done(null, results);
            }
          });
        } else {
          if (theFile.endsWith('.md')) {
            results.push(parse(theFile, dir));
          }
          pending = pending - 1;
          if (!pending) {
            done(null, results);
          }
        }
      });
    });

    return done(null, results);
  });
};

module.exports = () =>
  new Promise((resolve, reject) => {
    walk(novelDir, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });

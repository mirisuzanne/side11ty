'use strict';

const yaml = require('js-yaml');
const _ = require('lodash');
const image = require('@11ty/eleventy-img');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');

const type = require('./src/filters/type');

const imageShortcode = (src, alt, sizes, srcOnly) => {
  const imgSrc = src.startsWith('/images/')
    ? `./content${src}`
    : `./content/images/${src}`;

  const options = {
    widths: [300, 600, 900, 1200],
    formats: ['avif', 'webp', 'jpeg'],
    urlPath: '/images/',
    outputDir: './_site/images/',
  };

  image(imgSrc, options);

  const imageAttributes = {
    alt,
    sizes: sizes || '(min-width: 45em) 50vw, 100vw',
    loading: 'lazy',
    decoding: 'async',
  };

  // eslint-disable-next-line no-sync
  const metadata = image.statsSync(imgSrc, options);

  if (srcOnly) {
    const data = metadata.jpeg[metadata.jpeg.length - 1];
    return data.url;
  }

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: 'inline',
  });
};

module.exports = (eleventyConfig) => {
  eleventyConfig.setUseGitIgnore(false);

  // pass-through
  eleventyConfig.addPassthroughCopy({ _built: 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/remedy': 'assets/css' });
  eleventyConfig.addPassthroughCopy({ 'src/fonts': 'assets/fonts' });
  eleventyConfig.addPassthroughCopy('assets');

  // filters
  eleventyConfig.addFilter('merge', _.merge);
  eleventyConfig.addFilter('concat', _.concat);
  eleventyConfig.addFilter('shuffle', _.shuffle);
  eleventyConfig.addFilter('group', _.groupBy);

  eleventyConfig.addFilter('typogr', type.typogr);
  eleventyConfig.addFilter('md', type.md);
  eleventyConfig.addFilter('mdInline', type.mdInline);

  eleventyConfig.addFilter('yaml', yaml.load);

  // shortcodes
  eleventyConfig.addPairedShortcode('md', type.md);
  eleventyConfig.addPairedShortcode('mdInline', type.mdInline);
  eleventyConfig.addShortcode('year', () => {
    const now = new Date();
    return `${now.getUTCFullYear()}`;
  });

  eleventyConfig.addNunjucksShortcode('image', imageShortcode);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  // config
  eleventyConfig.setLibrary('md', type.mdown);
  eleventyConfig.addDataExtension('yaml', yaml.load);
  eleventyConfig.setQuietMode(true);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addWatchTarget('./src/novel/');
  eleventyConfig.setTemplateFormats([
    'md',
    'njk',
    'html',
    'txt',
    'ico',
    'css',
    '11ty.js',
  ]);

  // settings
  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'content',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};

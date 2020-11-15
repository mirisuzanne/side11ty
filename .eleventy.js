'use strict';

const yaml = require('js-yaml');
const _ = require('lodash');
const pluginLocalRespimg = require('eleventy-plugin-local-respimg');

const type = require('./src/filters/type');

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
  eleventyConfig.addFilter('group', _.groupBy);

  eleventyConfig.addFilter('typogr', type.typogr);
  eleventyConfig.addFilter('md', type.md);
  eleventyConfig.addFilter('mdInline', type.mdInline);

  eleventyConfig.addFilter('yaml', yaml.safeLoad);

  // shortcodes
  eleventyConfig.addPairedShortcode('md', type.md);
  eleventyConfig.addPairedShortcode('mdInline', type.mdInline);
  eleventyConfig.addShortcode('year', () => {
    const now = new Date();
    return `${now.getUTCFullYear()}`;
  });

  // config
  eleventyConfig.setLibrary('md', type.mdown);
  eleventyConfig.addDataExtension('yaml', yaml.safeLoad);
  eleventyConfig.setQuietMode(true);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setTemplateFormats([
    'md',
    'njk',
    'html',
    'txt',
    'ico',
    'css',
    '11ty.js',
  ]);

  eleventyConfig.addPlugin(pluginLocalRespimg, {
    folders: {
      source: 'content', // Folder images are stored in
      output: '_site', // Folder images should be output to
    },
    images: {
      resize: {
        min: 300, // Minimum width to resize an image to
        max: 1500, // Maximum width to resize an image to
        step: 300, // Width difference between each resized image
      },
      gifToVideo: false, // Convert GIFs to MP4 videos
      sizes: '100vw', // Default image `sizes` attribute
      lazy: false, // Include `loading="lazy"` attribute for images
      additional: ['assets/images/**/**/*'],
    },
  });

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

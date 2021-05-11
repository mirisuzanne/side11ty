---
layout: novel
pagination:
  data: novel
  size: 1
  alias: version
  addAllPagesToCollections: true
permalink: 'read/{{ version.slug }}/'
eleventyComputed:
  title: '{{ version.data.title or version.data.language }}'
---

import ccs from 'cascading-color-systems';

import filter from './filter';
import shuffle from './shuffle';
import toggle from './toggle';

ccs();
shuffle();
filter();
toggle('animate');
toggle('column');
toggle('align');

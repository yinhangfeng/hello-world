import { globbySync } from 'globby';

const paths = globbySync(['*', '!xxx.js']);
console.log(paths);

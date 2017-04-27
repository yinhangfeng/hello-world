import { name } from '../package.json';

global.__DEV__ = true;

export default function test(a) {
  console.log('test:', a, name);
  return a;
}
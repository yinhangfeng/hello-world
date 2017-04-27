// import/x.js

import a, {a as aa, b as ab} from './a';
import a1, {a as a1a, b as a1b} from './a1';
import {a as ba, b as bb} from './b';
import c from './c';
import d, {a as da, b as db} from './d';
import e from './e';

export default function () {
  console.log(a1, a1a, a1b);
  console.log(a, aa, ab);
  console.log(ba, bb);
  console.log(c);
  console.log(d, da, db);
  e();
}
'use strict';

function aaa() {
  return /abcd/;
}

console.log(aaa() === aaa())

console.log(/aaaa/ === /aaaa/)
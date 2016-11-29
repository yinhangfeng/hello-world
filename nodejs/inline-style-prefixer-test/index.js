'use strict';

const Prefixer = require('inline-style-prefixer')

const styles = {
  transition: '200ms all linear',
  userSelect: 'none',
  boxSizing: 'border-box',
  display: 'flex',
  color: 'blue',
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'flex-start',
  order: 1,
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  alignSelf: 'center',
}

function aaa() {
  return {
    transition: '200ms all linear',
    userSelect: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    color: 'blue',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'flex-start',
    order: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignSelf: 'center',
  };
}

console.time('aaa');
const prefixer = new Prefixer({ userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Chrome/25.0.1216.0 Safari/537.2'})
console.timeEnd('aaa');
console.time('bbb');
let prefixedStyles;
for (let i = 0; i < 1000; ++i) {
  prefixedStyles = prefixer.prefix(styles);
  //prefixedStyles = aaa();
}
console.timeEnd('bbb');

console.log(prefixedStyles);

// prefixedStyles === output
// const output = {
//   transition: '200ms all linear',
//   WebkitUserSelect: 'none',
//   boxSizing: 'border-box',
//   display: '-webkit-flex',
//   color: 'blue'
// }

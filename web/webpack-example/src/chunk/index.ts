import test1 from './test1';
import test3 from './test3';


function load() {
  console.log('object', test1.xxx, test3.xxx);
  debugger;
  import('./test2').then((test2) => {
    console.log('test2 loaded', test2.xxx);
  });

  import('./test3').then((test3) => {
    console.log('test3 loaded', test3.xxx);
  });

  import('./test4').then((test4) => {
    console.log('test4 loaded', test4.xxx);
  });
}


// trunk 测试
console.log('chunk index');
setTimeout(load);


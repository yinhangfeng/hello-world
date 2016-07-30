//dependencies 填写相对路径时 被依赖模块中的相对路径会相对于当前模块进行处理
//require('npmdeptest/test.js'); //不能以当前项目名开头引用当前项目中的文件
console.log('npm dep test')
var npmTest = require('yinhf-npmtest');
var npmLib1 = require('npmlib1');
var npmTest1 = require('npmtest1');
npmTest();
npmTest1();
npmLib1();
npmTest1();

debugger;

var npmTest2 = require('npmtest2');
var npmTest2AAA = require('npmtest2/AAA');

// global.__DEV__ = false;
// var ReactNative = require('react-native');
// console.log(ReactNative);

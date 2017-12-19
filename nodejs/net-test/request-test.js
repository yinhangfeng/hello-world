'use strict';

const request = require('request');

function proxyTest() {
  request({
    uri: 'http://example.com',
    headers: {
      'proxy-authorization': 'b63KcA6GUfDqkmzbTp5y',
    },
    proxy: 'http://example.com:7070',
    proxyHeaderWhiteList: ['proxy-authorization'],
    proxyHeaderExclusiveList: ['proxy-authorization'],
  }, (err, res, body) => {
    if (err) {
      console.error(err);
    }
    console.log(res); 
  });
}

proxyTest();
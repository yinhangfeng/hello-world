'use strict';

const request = require('request');

function proxyTest() {
  request({
    uri: 'http://localhost:9000',
    headers: {
      'proxy-authorization': 'xxxx',
    },
    proxy: 'http://localhost:8001',
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
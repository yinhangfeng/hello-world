var util = require('util'),
    http = require('http'),
    httpProxy = require('http-proxy'),
    querystring = require('querystring');
const connect = require('connect');

function postTest() {
  console.log('postTest');
  var postData = querystring.stringify({
    'msg' : 'Hello World!'
  });

  var options = {
    hostname: 'localhost',
    port: 8089,
    path: '/User/Index/login?LAB_JSON',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.')
    })
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

postTest();

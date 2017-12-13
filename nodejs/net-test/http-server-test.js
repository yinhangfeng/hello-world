var util = require('util'),
    http = require('http');

var server = http.createServer(function (req, res) {
  console.log('req', req.url, 'req.timeout=', req.timeout, 'res.timeout=', res.timeout);
  // req.setTimeout(1000, () => {
  //   console.log('req setTimeout xxxxx', req.timeout);
  // });
  // res.setTimeout(1000, () => {
  //   console.log('res setTimeout xxxxx', res.timeout);
  // });
  // setInterval(() => {
  //   console.log('setInterval res.finished', res.finished);
  // }, 1000);
  res.on('timeout', () => {
    console.log('res on timeout xxxx');
  });
  // res.writeHead(200, {
  //   'Content-Type': 'text/plain',
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Headers': 'lab_json,xxx',
  // });
  // res.write('Hello World');
  // res.end();
});
console.log('server.timeout=', server.timeout);
// server.setTimeout(5000, () => {
//   console.log('server setTimeout xxxxx', server.timeout);
// });
server.on('timeout', () => {
  console.log('server on timeout xxxxx');
});

server.listen(9003, () => {
  console.log('server listen at 9003');
});

const WebSocket = require('ws');

const ws = new WebSocket('ws://30.177.112.117:9222');

ws.on('open', function open() {
  console.log('open');
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log('message', data);
});

ws.on('error', (e) => {
  console.log('error', e);
});

ws.on('close', (e) => {
  console.log('close', e);
});
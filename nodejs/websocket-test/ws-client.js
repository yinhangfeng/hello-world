const WebSocket = require('ws');

const ws = new WebSocket('ws://10.0.11.36:8080/ws');

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
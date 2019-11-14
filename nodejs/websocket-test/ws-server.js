const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', function connection(ws, req) {

  ws._clientUrl = req.url;
  console.log('connection', req.url);

  console.log('clients', Array.from(wss.clients).map(ws => ws._clientUrl));

  ws.on('message', function incoming(message) {
    console.log('ws message', message);
  });

  ws.send('something');
});

wss.on('error', (e) => {
  console.log('error', e);
});

wss.on('close', (e) => {
  console.log('close', e);
});

wss.on('headers', (e) => {
  console.log('headers', e);
});

wss.on('listening', (e) => {
  console.log('listening', e);
});
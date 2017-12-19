// http://blog.csdn.net/foruok/article/details/48572053
// https://segmentfault.com/a/1190000011366156

const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('close', () => {
  console.log('close');
});

server.on('error', err => {
  console.log('error', err);
});

server.on('listening', () => {
  console.log('listening');
});

server.on('message', (msg, rinfo) => {
  console.log(`message from client ${rinfo.address}:${rinfo.port}-${msg}`);
  server.send(
    `welcome ${rinfo.address}:${rinfo.port}`,
    rinfo.port,
    rinfo.address
  );
  setTimeout(function() {
    server.send(`exit`, rinfo.port, rinfo.address);
  }, 2000);
});

server.bind(8060);

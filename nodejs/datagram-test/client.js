const dgram = require('dgram');

const client = dgram.createSocket('udp4');

client.on('close', () => {
  console.log('close');
});

client.on('error', err => {
  console.log('error', err);
});

client.on('listening', () => {
  console.log('listening');
});

client.on('message', (msg, rinfo) => {
  if (msg == 'exit') {
    client.close();
  }
  console.log(`message from server ${rinfo.address}:${rinfo.port}-${msg}`);
});

// client.bind(9999); 如果不调用bind 则在 send 时会随机分配一个端口 用于接收服务器的返回信息

client.send(`hello`, 8060, '127.0.0.1');

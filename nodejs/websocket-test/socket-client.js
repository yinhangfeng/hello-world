'use strict';

const socketIoClient = require('socket.io-client');

// const certConfig = require('../temp/openssl/cert');

// https://github.com/socketio/socket.io-client/blob/master/docs/API.md
// https://github.com/socketio/engine.io-client
// https wss
// const socket = socketIoClient('wss://localhost:5000', {
//   transports: ['websocket'],
//   // transportOptions: {},
//   // pfx, key, passphrase, cert, ca,
//   forceNode: true,
//   // secure: true, 默认根据url http https ws wss
//   query: { //   如果uri提供了 则会被覆盖
//     xxx: true,
//   },
//   key: certConfig.client.key,
//   cert: certConfig.client.cert,
//   ca: certConfig.ca.cert,
//   rejectUnauthorized: true,
//   agent: false,
//   secure: true,
// });

const socket = socketIoClient('ws://localhost:5001', {
  transports: ['websocket'],
  // transportOptions: {},
  // pfx, key, passphrase, cert, ca,
  forceNode: true,
  // secure: true, 默认根据url http https ws wss
  query: { //   如果uri提供了 则会被覆盖
    xxx: true,
  },
});

const manager = socket.io;
console.log('manager.engine.transport:', manager.engine.transport.constructor);

// 连接由于某些原因被服务端拒绝之后 可以设置
// manager.reconnectionDelayMax(300000)

function requestSocket(socket, data) {
  return new Promise((resolve, reject) => {
    socket.emit('bbb', data, (resData) => {
      resolve(resData);
    });
    const ackId = socket.ids - 1;
    setTimeout(() => {
      delete socket.acks[ackId];
      reject(new Error('timeout'));
    }, 10000);
    // TODO 其它socket error 造成的ack不成功
  });
}

function emitBBB(socket) {
  requestSocket(socket, {
    a: 1,
    b: 'xxx',
    c: {
      d: 1,
    }
  }).then((res) => {
    console.log('emit bbb ack', res);
  }, (err) => {
    console.log('emit bbb ack err', err);
  });
}

socket.on('connect', function () {
  console.log(
    'socket on connection socket.id:',
    socket.id,
    'socket.upgraded:',
    socket.upgraded
  );

  // socket.on('binary-test', (data, fn) => {
  //   console.log('binary-test ', data);
  //   setTimeout(() => {
  //     fn(Buffer.from('binary-test-res'));
  //   });
  // });
});

socket.on('connect', () => {
  console.log('socket event connect');
});

socket.on('connect_error', (err) => {
  console.log('socket event connect_error', err);
});

socket.on('connect_timeout', (timeout) => {
  console.log('socket event connect_timeout', timeout);
});

socket.on('error', (err) => {
  console.log('socket event error', err.code, err.message);
  logging.error('api-socket-client-error', {
    socketId: socket.id,
    error: errors.errorToPlainObject(err),
  });
});

socket.on('disconnect', (reason) => {
  console.log('socket event disconnect', reason);
});

socket.on('reconnect', (attempt) => {
  console.log('socket event reconnect', attempt);
});

socket.on('reconnect_attempt', (attempt) => {
  console.log('socket event reconnect_attempt', attempt);
});

socket.on('reconnecting', (attempt) => {
  console.log('socket event reconnecting', attempt);
});

socket.on('reconnect_error', (err) => {
  console.log('socket event reconnect_error', err);
});

socket.on('reconnect_failed', (reconnectionAttempts) => {
  console.log('socket event reconnect_failed', reconnectionAttempts);
});

socket.on('ping', () => {
  console.log('socket event ping');
});

socket.on('pong', (ms) => {
  console.log('socket event pong', ms);
});

socket.on('message', (e) => {
  console.log('message', e);
});

setTimeout(() => {
  socket.send({
    test: 'test-client-message',
  });
}, 1000);

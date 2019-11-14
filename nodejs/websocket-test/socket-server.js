'use strict';

const http = require('http');
const https = require('https');
const socketIo = require('socket.io');

// const certConfig = require('../temp/openssl/cert');

// const httpServer = https.createServer({
//   key: certConfig.server.key,
//   cert: certConfig.server.cert,
//   ca: [certConfig.ca.cert],
//   // https://nodejs.org/dist/latest-v8.x/docs/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
//   // 下面两项为true 则client 必须提供 key cert
//   requestCert: true,
//   rejectUnauthorized: true,
// }, (req, res) => {
//   console.log('httpServer on request', req.url);
//   res.write('xxx');
//   res.end();
// });

const httpServer = http.createServer((req, res) => {
  console.log('httpServer request')
  res.write('xxx');
  // socket server 不允许普通http请求
  res.writeHead(403);
  res.end();
});


httpServer.on('upgrade', function (req, socket, head) {
  console.log('httpServer upgrade', req.url);
});

// https://github.com/socketio/socket.io/blob/master/docs/API.md
// https://github.com/socketio/engine.io
const server = socketIo(httpServer, {
  serveClient: false,
  allowRequest: (req, fn) => {
    // req.connection.getPeerCertificate(true) 获取客户端的证书信息
    console.log('server allowRequest', req.url);

    if (req._query.xxx) {
      fn(null, true);
    } else {
      fn('forbidden', false);
    }
  },
  transports: ['websocket'],

  // pingInterval: 300000,
});

httpServer.listen(5001);

function requestSocket(socket, data) {
  return new Promise((resolve, reject) => {
    function requestSocketAck(error, resData) {
      clearTimeout(timeoutId);
      if (error) {
        // TODO 包装error
        reject(error);
      } else {
        // XXX 可能需要对data处理
        resolve(resData);
      }
    }
    requestSocketAck._requestSocket = true;
    socket.emit('bbbb', data, requestSocketAck);
    const ackId = socket.nsp.ids - 1;
    let timeoutId = setTimeout(() => {
      timeoutId = null;
      delete socket.acks[ackId];
      requestSocketAck(new Error('timeout'));
    }, 10000);
  });
}

function emitBBBB(socket) {
  requestSocket(socket, {
    a: 'xx',
    b: 'xxx',
    c: {
      d: 1,
    }
  }).then((res) => {
    console.log('emit bbbb ack', res);
  }, (err) => {
    console.log('emit bbbb ack err', err);
  });
}

server.on('connection', function(socket) {
  console.log(
    'server on connection socket.id:',
    socket.id,
    'socket.conn.transport.name:',
    socket.conn.transport.name,
    'socket.request._query:',
    socket.request._query
  );

  // 通过query 标记连接者
  if (!socket.request._query.xxx) {
    socket.emit('xxx_xxx');
    socket.disconnect(true);
    // socket.error('aaa');
    return;
  }

  socket.on('disconnect', function(reason) {
    console.log('socket disconnect', socket.id, reason);
    let acks = socket.acks;
    for (let ackId in acks) {
      if (acks.hasOwnProperty(ackId) && acks[ackId]._requestSocket) {
        acks[ackId](new Error('disconnect'));
      }
    }
  });

  socket.on('close', function() {
    console.log('socket close', socket.id);
  });

  socket.on('error', function(err) {
    console.log('socket error', socket.id, err);
  });

  socket.on('message', function(msg) {
    console.log('socket message', socket.id, msg);
  });

  socket.on('aaa', function(data, fn) {
    console.log('socket', socket.id, 'event aaa', data);
  });

  socket.on('bbb', function(data, fn) {
    console.log('socket', socket.id, 'event bbb', data);
    setTimeout(() => {
      fn(111, {
        xx: 22,
      });
    }, 5000);
    // socket.emit('bbbb', { hello: 'bbbb' });
  });

  setTimeout(() => {
    socket.send({
      test: 'test-server-message',
    });
  });

  // setTimeout(() => {
  //   emitBin(socket);
  // });
});

function emitBin(socket) {
  socket.emit('binary-test', Buffer.from('binary-test'), (res) => {
    console.log(res);
  });
}

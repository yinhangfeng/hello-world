var util = require('util'),
    http = require('http'),
    httpProxy = require('http-proxy'),
    querystring = require('querystring');
const connect = require('connect');

var proxy = new httpProxy.createProxyServer({
  changeOrigin: true,
});

proxy.on('error', function (err, req, res) {
  console.log('proxy error');
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

proxy.on('proxyRes', function (proxyRes, req, res) {
  //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
  //console.log('==== proxyRes  ', proxyRes, '\n==========res  ', res);
});

// proxy.on('open', function (proxySocket) {
//   proxySocket.on('data', hybiParseAndLogMessage);
// });

proxy.on('close', function (res, socket, head) {
  // view disconnected websocket connections
  console.log('Client disconnected');
});

function simpleProxyServer() {
  http.createServer(function (req, res) {
    console.log('======origin');
    // proxy.web(req, res, {
    //   target: 'http://localhost:9002'
    // });


    proxy.web(req, res, {
      target: 'http://basic2.hz.backustech.com'
    });
  }).listen(8002);
}

function connectProxyServer() {
  const app = connect()
    //.use(loadRawBodyMiddleware)
    //.use(connect.compress())
    //.use(getDevToolsMiddleware(args, () => wsProxy && wsProxy.isChromeConnected()))
    //.use(getDevToolsMiddleware(args, () => ms && ms.isChromeConnected()))
    //.use(openStackFrameInEditorMiddleware)
    //.use(statusPageMiddleware)
    //.use(systraceProfileMiddleware)
    //.use(cpuProfilerMiddleware)
    //.use(packagerServer.processRequest.bind(packagerServer));

  //RW 代理 将其他请求(非静态资源 非打包数据)代理到指定的服务器
  app.use((req, res, next) => {
    console.log('======connect origin ', req.url);
    // proxy.web(req, res, {
    //   target: 'http://basic2.hz.backustech.com'
    // });
    res.write('Hello World');
    res.end();
  });

  app.use(connect.logger())
    .use(connect.errorHandler());

  const serverInstance = http.createServer(app).listen(8002);
  serverInstance.timeout = 0;
}

connectProxyServer();

//
// Target Http Server
//
http.createServer(function (req, res) {
  console.log('========target ', req);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9002);

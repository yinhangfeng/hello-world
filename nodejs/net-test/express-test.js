'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// 模拟延迟
app.use((req, res, next) => {
  setTimeout(next, Math.random() * 2000);
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/error', (req, res) => {
  console.log('/error');
  res.status(200).send('<title>errorCode</title>errorCode<script>window.__LAB_Auth && __LAB_Auth.sendAuthResult(errorCode)</script>').end();
});

app.get('/', (req, res) => {
  console.log('/');
  res.status(200).send('Hello World!').end();
});

app.get('/test', (req, res) => {
  // console.log('/test', req.url, req.body);
  res.status(200).send('Hello World!').end();
});

app.use((req, res, next) => {
  res.status(404).send('not found').end();
});

let port = process.argv[2] || 9002;

var server = app.listen(port, function() {
  var port = server.address().port;
  console.log('Server started: http://localhost:' + port + '/');
});

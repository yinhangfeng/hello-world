'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use('/static', express.static(__dirname + '/static'));

let port = process.argv[2] || 9000;

var server = app.listen(port, function() {
  var port = server.address().port;
  console.log('Server started: http://localhost:' + port + '/');
});

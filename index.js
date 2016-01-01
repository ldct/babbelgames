var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var async = require('async');

var db = require('./postgres');

app.use(cors());
app.use(bodyParser.json({ 'limit': '10mb' }));
app.use(morgan('dev'));

var port = +process.argv[2] || 3000;
server.listen(port, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('frex-backend listening at http://%s:%s', host, port);

});

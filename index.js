var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var async = require('async');
var fs = require('fs');

// var db = require('./postgres');

app.use(cors());
app.use(bodyParser.json({ 'limit': '10mb' }));
app.use(morgan('dev'));

app.get('/lists/1.json', function (err, res) {
  var list1 = fs.readFileSync('week1.json', 'utf-8');
  return res.json(JSON.parse(list1));
});

app.get('/lists/2.json', function (err, res) {
  var list1 = fs.readFileSync('week2.json', 'utf-8');
  return res.json(JSON.parse(list1));
});

var port = +process.argv[2] || 3000;
server.listen(port, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('frex-backend listening at http://%s:%s', host, port);

});

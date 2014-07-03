
var express = require('express');
var app = express();

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.get('/', function(req, res){
  res.send('hello world');
});


app.use(express.static(__dirname + '/public'));

app.listen(5000);

require('./util.js');

var express = require('express');
var app = express.createServer();
app.configure(function() {
   this.set('view engine', 'ejs');
   this.use(express.bodyParser());
   this.use(express.methodOverride());
   this.use(express.static(__dirname + '/public'));
});
app.listen(1337);

app.get('/', function(req, res){
   res.render('index');
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sample1');

require('./people.js').initialize(app, mongoose);

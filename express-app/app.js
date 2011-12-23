var util = require('util');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sample1');
var PersonSchema = new mongoose.Schema({
      firstName: String,
      lastName: String
   });
var Person = mongoose.model('Person', PersonSchema);

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

app.get('/people', function(req, res){
   showAllPeople(req, res);
});

showAllPeople = function(req, res) {
   Person.find(function(err, docs) {
      docs.each(function(entity) {
         console.log(util.inspect(entity));
      });
      res.render('people/index', {people: docs});
   });
}

app.get('/people/new', function(req, res){
   res.render('people/create');
});

app.delete('/people/:id', function(req, res){
   var id = req.params.id;
   console.log('deleting person: ' + id);
   Person.findById(id, function(err, doc) {
      doc.remove(function(err) {
         res.send({});
      });
   });
});

app.get('/people/:id', function(req, res){
   var id = req.params.id;
   Person.findById(id, function(err, doc) {
      res.render('people/edit', {person: doc});
   });
});

app.post('/people', function(req, res){
   var person = new Person();
   person.firstName = req.body.person.firstName;
   person.lastName = req.body.person.lastName;
   person.save(function(err) {
      console.log('creating: ' + util.inspect(person));
      showAllPeople(req, res);
   });
});

app.put('/people', function(req, res){
   var id = req.body.person.id;
   Person.findById(id, function(err, doc) {
      doc.firstName = req.body.person.firstName;
      doc.lastName = req.body.person.lastName;
      doc.save(function(err) {
         console.log('updating: ' + doc);
         showAllPeople(req, res);
      });
   });
});


if (!Array.prototype.each) {
   Array.prototype.each = function(func) {
      for (var i=0; i<this.length; i++) {
         var element = this[i];
         func(element);
      }
   }
}


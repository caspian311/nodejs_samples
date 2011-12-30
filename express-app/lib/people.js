var util = require('util');
var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
      firstName: String,
      lastName: String
   });
var Person = mongoose.model('Person', PersonSchema);

exports.index = function(req, res){
   connect();

   showAllPeople(req, res);

   disconnect();
};

function showAllPeople(req, res) {
   Person.find(function(err, docs) {
      docs.each(function(entity) {
         console.log(util.inspect(entity));
      });
      res.render('people/index', {people: docs});
   });
}

exports.new = function(req, res){
   res.render('people/create');
};

exports.destroy = function(req, res){
   connect();

   var id = req.params.person;
   console.log('deleting person: ' + id);
   Person.findById(id, function(err, doc) {
      doc.remove(function(err) {
         res.send({});

         disconnect();
      });
   });
};

exports.edit = function(req, res){
   connect();

   var id = req.params.person;
   Person.findById(id, function(err, doc) {
      res.render('people/edit', {person: doc});

      disconnect();
   });
};

exports.create = function(req, res){
   connect();

   var person = new Person();
   person.firstName = req.body.person.firstName;
   person.lastName = req.body.person.lastName;
   person.save(function(err) {
      console.log('creating: ' + util.inspect(person));
      showAllPeople(req, res);

      disconnect();
   });
};

exports.update = function(req, res){
   connect();

   var id = req.body.person.id;
   Person.findById(id, function(err, doc) {
      doc.firstName = req.body.person.firstName;
      doc.lastName = req.body.person.lastName;
      doc.save(function(err)  {
         console.log('updating: ' + doc);
         showAllPeople(req, res);

         disconnect();
      });
   });
};

function connect() {
   mongoose.connect('mongodb://localhost/sample');
}

function disconnect() {
   mongoose.disconnect();
}

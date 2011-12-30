var util = require('util');
var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      middleName: String
   });
var Person = mongoose.model('Person', PersonSchema);

exports.index = function(req, res){
   showAllPeople(req, res);
};

function showAllPeople(req, res) {
   Person.find(function(err, people) {
      people.each(function(entity) {
         console.log(util.inspect(entity));
      });
      res.render('people/index', {people: people});
   });
}

exports.new = function(req, res){
   res.render('people/create');
};

exports.destroy = function(req, res){
   var id = req.params.person;
   console.log('deleting person: ' + id);
   Person.findById(id, function(err, doc) {
      doc.remove(function(err) {
         res.send({});
      });
   });
};

exports.edit = function(req, res){
   var id = req.params.person;
   Person.findById(id, function(err, doc) {
      res.render('people/edit', {person: doc});
   });
};

exports.create = function(req, res){
   var person = new Person();
   person.firstName = req.body.person.firstName;
   person.lastName = req.body.person.lastName;
   person.middleName = req.body.person.middleName;
   person.save(function(err) {
      console.log('creating: ' + util.inspect(person));
      showAllPeople(req, res);
   });
};

exports.update = function(req, res){
   var id = req.body.person.id;
   Person.findById(id, function(err, doc) {
      doc.firstName = req.body.person.firstName;
      doc.lastName = req.body.person.lastName;
      doc.middleName = req.body.person.middleName;
      doc.save(function(err)  {
         console.log('updating: ' + doc);
         showAllPeople(req, res);
      });
   });
};

require('should');

var mongoose = require('mongoose');
var personSchema = new mongoose.Schema({
   firstName: String,
   lastName: String,
   middleName: String
});
var Person = mongoose.model('Person', personSchema);

var testObject;
testObject = require('../lib/people_controller.js');

describe('PeopleController', function() {
   beforeEach(function() {
      mongoose.connect('mongodb://localhost/sample1_test');
      Person.find(function(err, docs) {
         docs.forEach(function(doc) {
            doc.remove();
         });
      });
   });

   afterEach(function() {
      mongoose.disconnect();
   });

   describe('#index', function() {
      it('should show all people', function() {
         var people = [{}, {}];

         Person.find = function(callback) {
            callback({}, people);
         };

         var _view;
         var _obj;
         var res = {
            render: function(view, obj) {
               _view = view;
               _obj = obj;
            }
         };

         testObject.index({}, res);

         _view.should.equal('people/index');
         _obj.should.have.property.people;
         _obj.people.length.should.equal(2);
      });
   });
});


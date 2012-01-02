require('should');
var util = require('util');

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
      Person.find(function(doc) {
         doc.remove();
      });

   });

   afterEach(function() {
      mongoose.disconnect();
   });

   describe('#index', function() {
      it("should show all people", function() {
         var person1 = new Person();
         var person2 = new Person();

         person1.save();
         person2.save();

         var _view;
         var _obj;
         var res = {
            render: function(view, obj) {
               _view = view;
               _obj = obj;
            }
         };

         testObject.index({}, res);

         console.log('response object:', util.inspect(_obj));

         _view.should.equal('people/index');
         _obj.should.have.property.people;
         _obj.people.length.should.equal(2);
      });
   });
});


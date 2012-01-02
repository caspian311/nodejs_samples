require('should');

var mongoose = require('mongoose');
var Person = mongoose.model('Person',  new mongoose.Schema());

var testObject = require('../lib/people_controller.js');

describe('PeopleController', function() {
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


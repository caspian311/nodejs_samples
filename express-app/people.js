var util = require('util');

exports.initialize = function(app, mongoose) {
   var PersonSchema = new mongoose.Schema({
         firstName: String,
         lastName: String
      });
   var Person = mongoose.model('Person', PersonSchema);

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
         doc.save(function(err)  {
            console.log('updating: ' + doc);
            showAllPeople(req, res);
         });
      });
   });
}


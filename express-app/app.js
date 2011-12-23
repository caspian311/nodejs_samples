var express = require('express')
var app = express.createServer();
app.configure(function() {
   this.set('view engine', 'ejs');
   this.use(express.bodyParser());
   this.use(express.methodOverride());
});
app.listen(1337);

app.get('/', function(req, res){
   res.render('index');
});

app.get('/people', function(req, res){
   showAllPeople(req, res);
});

showAllPeople = function(req, res) {
   var peopleList = [
               {id: 1, firstName: 'Matt', lastName: 'Todd'},
               {id: 2, firstName: 'Abbi', lastName: 'Todd'},
               {id: 3, firstName: 'Caleb', lastName: 'Todd'},
               {id: 4, firstName: 'Aurelia', lastName: 'Todd'}
            ];
   res.render('people/index', {people: peopleList});
}

app.get('/people/new', function(req, res){
   res.render('people/create');
});

app.get('/people/:id', function(req, res){
   var id = req.params.id;
   var person = {id: 1, firstName: 'Matt', lastName: 'Todd'};
   res.render('people/edit', {person: person });
});

app.post('/people', function(req, res){
   var person = req.body.person;
   console.log('creating: ' + person);
   showAllPeople(req, res);
});

app.put('/people', function(req, res){
   var person = req.body.person;
   console.log('updating: ' + person);
   showAllPeople(req, res);
});


if (!Array.prototype.each) {
   Array.prototype.each = function(func) {
      for (var i=0; i<this.length; i++) {
         var element = this[i];
         func(element);
      }
   }
}


/**
 * Module dependencies.
 */

var util    = require('util')
  , url     = require('url')
  , express = require('express')
  , factsdb = require('./factsdb')
  , routes = require('./routes')
  , stylus = require('stylus')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.logger());
  //app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + "/public",
    compress: true
  }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


factsdb.connect(function(error) {
    if (error) throw error;
});
app.on('close', function(errno) {
    factsdb.disconnect(function(err) { });
});

// Routes

app.get('/', routes.index);
app.get('/hero/:name', routes.hero);
app.post('/hero/add-fact', routes.addFact);
app.post('/hero/edit-fact', routes.editFact);
app.get('/hero/delete-fact/:id', routes.deleteFact);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

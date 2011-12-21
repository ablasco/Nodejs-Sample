var _ = require('underscore')
  , factsdb = require('../factsdb')


exports.index = function(req, res) {
  factsdb.allFacts(function(err, facts) {
    if (err) {
      util.log('ERROR ' + err);
      throw err;
    } else {
      var heroes = facts.map(function(p) { return p.hero; });
      var names = _.uniq(heroes);
      res.render('index', { heroes: names });
    }
  });
};


exports.hero = function(req, res) {
  factsdb.findFactsByHero(req.params.name, function(err, facts) {
    if (err) {
      util.log('ERROR ' + err);
      throw err;
    } else {
      res.json(facts);
    }
  });
};


exports.addFact = function(req, res) {
  factsdb.add(req.body.author, req.body.name, req.body.fact, function(error) {
    if (error) throw error;
    res.json({status: 'ok' });
    console.log('New fact for ' + req.body.name + ': ' + req.body.fact);
    //res.redirect('/');
  });
};

var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dburl = 'mongodb://localhost/factsdb';

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.setup = function(callback) { callback(null); }

var FactSchema = new Schema({
    ts     : { type: Date, default: Date.now },
    author : String,
    hero   : String,
    fact   : String
});

mongoose.model('Fact', FactSchema);
var Fact = mongoose.model('Fact');


/**
 * Empty Fact document.
 */
exports.emptyFact = { "_id": "", author: "", hero: "", fact: "" };

/**
 * Adds a new Fact to the DB.
 * @param {String} author
 * @param {String} hero
 * @param {String} fact
 * @param {Function} callback
 */
exports.add = function(author, hero, fact, callback) {
    var newFact = new Fact();
    newFact.author = author;
    newFact.hero   = hero;
    newFact.fact   = fact;
    newFact.save(function(err) {
        if (err) {
            util.log('FATAL '+ err);
            callback(err);
        } else
            callback(null);
    });
}

/**
 * Removes a Fact from the DB.
 * @param {String} id
 * @param {Function} callback
 */
exports.delete = function(id, callback) {
    exports.findFactById(id, function(err, doc) {
        if (err) 
            callback(err);
        else {
            util.log(util.inspect(doc));
            doc.remove();
            callback(null);
        }
    });
}

/**
 * Updates a Fact for a given "id".
 * @param {String} id
 * @param {String} author
 * @param {String} fact
 * @param {Function} callback
 */
exports.edit = function(id, author, hero, fact, callback) {
    exports.findFactById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.ts     = new Date();
            doc.author = author;
            doc.hero   = hero;
            doc.fact   = fact;
            doc.save(function(err) {
                if (err) {
                    util.log('FATAL '+ err);
                    callback(err);
                } else
                    callback(null);
            });
        }
    });    
}

/**
 * Lists all Facts.
 * @param {Function} callback
 */
exports.allFacts = function(callback) {
    Fact.find({}, callback);
}

/**
 * Executes "doEach" for every document found, and "done" when done.
 * @param {Function} doEach
 * @param {Function} done
 */
exports.forAll = function(doEach, done) {
    Fact.find({}, function(err, docs) {
        if (err) {
            util.log('FATAL '+ err);
            done(err, null);
        }
        docs.forEach(function(doc) {
            doEach(null, doc);
        });
        done(null);
    });
}

/**
 * Retrieves a Fact for a given "id".
 * @param {String} id
 * @param {Function} callback
 */
exports.findFactById = function(id, callback) {
    Fact.findOne({ _id: id }, function(err, doc) {
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}

exports.findFactsByHero = function(hero, callback) {
    Fact.find({ hero: hero }, function(err, doc) {
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}


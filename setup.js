var util = require('util');
var async = require('async');
var factsdb = require('./factsdb');

factsdb.connect(function(error) {
    if (error) throw error;
});

// Load fixtures into DB.
factsdb.setup(function(error) {
    if (error) {
        util.log('ERROR ' + error);
        throw error;
    }

    async.series([
        function(cb) {
            factsdb.add('anonymous', 'Chuck Norris', 'No existe la teoria de la evolucion, tan solo una lista de las especies que Chuck Norris permite vivir.', function(error) {
                if (error) util.log('ERROR ' + error);
                cb(error);
            });
        },
        function(cb) {
            factsdb.add('anonymous', 'Chuck Norris', 'Chuck Norris no te pisa un pie, sino el cuello.', function(error) {
                if (error) util.log('ERROR ' + error);
                cb(error);
            });
        },
        function(cb) {
            factsdb.add('anonymous', 'Chuck Norris', 'Chuck Norris borro la papelera de reciclaje.', function(error) {
                if (error) util.log('ERROR ' + error);
                cb(error);
            });
        },
        function(cb) {
            factsdb.add('anonymous', 'Bruce Scheneier', 'Science is defined as mankinds futile attempt at learning Bruce Schneiers private key.', function(error) {
                if (error) util.log('ERROR ' + error);
                cb(error);
            });
        },
        function(cb) {
            factsdb.add('anonymous', 'Bruce Scheneier', 'Others test numbers to see whether they are prime. Bruce decides whether a number is prime.', function(error) {
                if (error) util.log('ERROR ' + error);
                cb(error);
            });
        },
        function(cb) {
            factsdb.add('anonymous', 'Arturo Perez-Reverte', 'Perez-Reverte se baja musica en casa de Ramoncin.', function(error) {
                if (error) util.log('ERROR ' + error);
                cb(error);
            });
        },
        function(cb) {
            factsdb.add('anonymous', 'Arturo Perez-Reverte', 'Perez-Reverte no necesita investigar para escribir novela historica, el pasado cambia conforme teclea en la maquina.', function(error) {
                if (error) util.log('ERROR ' + error);
                cb(error);
            });
        }
        ],
        function(error, results) {
            // Disconnect when all fixtures had been loaded.
            factsdb.disconnect(function(err) { });
        }
    );
});


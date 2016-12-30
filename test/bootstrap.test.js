require('babel-polyfill');
var Sails = require('sails');
var testConfig = require("../config/env/test.js");
var Promise = require('bluebird');
var app;
before(function (done) {
  Sails.lift(testConfig, function (err, sails) {
    if (err) return done(err);
    app = sails;
    done(err, sails);
  });
});

//after(function (done) {
//  // here you can clear fixtures, etc.
//  app.lower(done);
//});

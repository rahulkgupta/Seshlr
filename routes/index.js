var querystring = require('querystring');
var OAuth= require('oauth').OAuth;

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.home = function(req, res){
  res.render('home', { title: 'Login Succesful'})
};
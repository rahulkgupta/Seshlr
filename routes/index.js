var querystring = require('querystring');
var mongoose = require('mongoose');

exports.index = function(req, res){
	if (!req.loggedIn) {
		res.render('index', { title: 'Express' });
	} else {
		res.render('home' , { title: 'Welcome'});	
	}	
};

exports.home = function(req, res){
  	if (req.loggedIn) {
		res.render('home', { title: 'Login Succesful'});
	}
	else {
		res.render('home', { title: 'Pecked up'});
	}
};



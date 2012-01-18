var querystring = require('querystring');
var mongoose = require('mongoose');

exports.index = function(req, res){
	if (req.loggedIn) {
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
		res.render('index', { title: 'Pecked up'});
	}
};

exports.classes = function (req, res) {
	var classes = mongoose.model('Class'); 	
	var scheds = classes.find({}, function (err,docs) {
		console.log(docs);
	});
	//console.log(scheds);
	res.render ('home' , { title: 'Welcome'});	
}

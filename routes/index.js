var querystring = require('querystring');
var mongoose = require('mongoose');

exports.index = function(req, res){
	if (req.loggedIn) {
		res.render('home', { title: 'Welcome' });
	} else {
		res.render('index' , { title: 'Login'});	
	}	
};

exports.home = function(req, res){
  if (req.loggedIn) {
		res.render('home', { title: 'Welcome'});
	}
	else {
		res.render('home', { title: 'Pecked up'});
	}
};

exports.classes = function (req, res) {
	var classes = mongoose.model('Class'); 	
	var scheds = classes.find({}, function (err,docs) {
		console.log(docs);
		res.render ('classes' , { title: 'Welcome', scheds: docs });
	});
	//console.log(scheds);	
}


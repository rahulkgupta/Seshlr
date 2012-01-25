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
		//console.log(req.user);	
		res.render('home', { title: 'Welcome'});
	}
	else {
		// res.redirect('/'); Eventually this needs to be enabled.
		res.render('home', { title: 'Welcome'});
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

exports.addClass = function (req, res) {
	console.log(req.params.id);
	if (req.loggedIn) {
		var classes = mongoose.model('Class'); 
		var course = classes.findById(req.params.id, function (err,doc) {
			console.log(doc);
			console.log(req.user);
			req.user.classes.push({num: 'test'});
			req.user.save(function (err) {
				if (err) console.log(err);
			});
		});
		
	}
	res.redirect('home');
}


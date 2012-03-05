var querystring = require('querystring');
var mongoose = require('mongoose');

exports.index = function(req, res){
	if (req.loggedIn) {
		res.redirect('/home');
	} else {
		res.render('index' , { title: 'Seshlr'});	
	}	
};

exports.home = function(req, res){
  if (req.loggedIn) {
  	if (req.session.userExists) {
  	// if (false) { 
  		res.render('home', { title: 'Welcome'}); 
  	} else {
  		res.redirect('/signup');
  	}
  } else {
  	res.redirect('/');
  }
}

exports.signup = function(req, res) {
	mongoose.model('Class').distinct('dept', {}, function(err, depts) {
	typeahead_depts = []
	depts.forEach(function(dept) {
		typeahead_depts.push('"' + dept + '"');
	});
		res.render('signup', { title: 'Get started with Seshlr', depts: typeahead_depts});
	});
}
/*******************
	Don't need any of this stuff anymore since we're pulling all the data using the APIs and Backbone.
		userId = req.user.id;
		mongoose.model('User')
		.findById(userId)
		.populate('classes')
		.run(function (err, usr) {	
			mongoose.model('StudyTime')
			.find({users : userId})
			.run(function (err, studytimes) {
				mongoose.model('StudyTime')
				.find({course: {$in : usr.classes}})
				.populate('course',['name','_id'])
				.run(function (err, studyfeeds) {
						res.render('home', { title: 'Welcome', userdata: usr, sessions: studytimes, sessionfeed: studyfeeds, rooturl: ''});
				}); 
				//console.log(studytimes)
				
			});
			
		});
	}
	//console.log(studytimes)
	else {
		res.redirect('/');
	}
}; */

exports.addClass = function (req, res) {

	res.render ('addclass' , { title: 'Add Course'});
	//console.log(scheds);	
}

exports.sessions = function (req, res) {
	if (req.loggedIn) {
		res.render ('sessions', { title: 'Sessions', userdata: req.user, rooturl: ''});
	}
	else {
		res.redirect('/');
	}
};

exports.sessionPage = function (req, res) {
	if (req.loggedIn) {
		userId = req.user.id;
		mongoose.model('StudyTime')
		.findById(req.params.id)
		.populate('classes')
		.run(function(err, sesh) {
			mongoose.model('User')
			.findById(userId)
			.populate('classes')
			.run(function(err, usr) {
				mongoose.model('StudyTime')
					.find({users: userId})
					.run(function(err, studytimes) {
						console.log(studytimes)
						res.render('sessions/page', { title: sesh.title , sessions: studytimes, session: sesh, userdata: usr, rooturl: '..' });
					});
			});
		});
	}
	else {
		res.redirect('/');
	}
};

exports.settings = function (req, res) {
	if (req.loggedIn) {
		mongoose.model('Class').distinct('dept', {}, function(err, depts) {
		typeahead_depts = []
		depts.forEach(function(dept) {
			typeahead_depts.push('"' + dept + '"');
		});
			res.render('settings', { title: 'Settings', depts: typeahead_depts});
		});
	}
	else {
		res.redirect('/');
	}
}

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
		res.render('home', { title: 'Home'});
	}
	//console.log(studytimes)
	else {
		res.redirect('/');
	}
};

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
	res.render('settings', {title: 'Settings'});
}


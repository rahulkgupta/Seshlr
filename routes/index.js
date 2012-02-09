var querystring = require('querystring');
var mongoose = require('mongoose');


exports.index = function(req, res){
	if (req.loggedIn) {
		res.redirect('/home');
	} else {
		res.render('index' , { title: 'StudyWithMe'});	
	}	
};

exports.home = function(req, res){
  if (req.loggedIn) {
		res.render('home', { title: 'Welcome', userdata: req.user, rooturl: ''});
	}
	else {
		res.redirect('/');
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
		var sessions = mongoose.model('StudyTime');
		var sessionTitle = sessions.findById(req.params.id, function(err, doc) {
			if (err) {
				console.log (err);
				// If the session has been deleted or the user enters an invalid URL
				res.render('sessions/notfound', { title: 'Session not Found', userdata: req.user, rooturl: '..' });
			}
			else {
				res.render('sessions/page', { title: doc.title , session: doc, userdata: req.user, rooturl: '..' });
			}
		});
	}
	else {
		res.redirect('/');
	}
}

/* exports.addClass = function (req, res) {
	console.log(req.params.id);
	if (req.loggedIn) {
		var classes = mongoose.model('Class'); 
		var course = classes.findById(req.params.id, function (err,doc) {
			console.log(doc);
			console.log(req.user);
			req.user.classes.push(doc);
			req.user.save(function (err) {
				if (err) console.log(err);
			});
		});
		
	}
	res.redirect('/home');
}

 exports.createSession = function (req, res) {
	var study = mongoose.model('StudyTime');
	var sesh = new study();
	var time = req.body.time;
	var title = req.body.title;
	var course = req.body.course;
	console.log(course);
	var description = req.body.description;
	var location = req.body.location;
	sesh.time = time;
	sesh.title = title;
	sesh.description = description;
	var x = "hello"
	var classes = mongoose.model('Class'); 
	var course = classes.findById(course, function (err,doc) {
		console.log(x);
		sesh.course.push(doc);
		sesh.save(function (err) {
				if (err) console.log(err);
		});
	
		//sesh.save();
		req.user.studytimes.push(sesh);
		req.user.save(function (err, sesh) {
			if (err) {console.log(err);}
			else {
				console.log("courses " + sesh)
					//now.addSession(sesh);
			}
		});
	});
} */


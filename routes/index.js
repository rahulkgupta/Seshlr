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
		res.render('home', { title: 'Welcome', courses: req.user.classes});
	}
	else {
		// res.redirect('/'); Eventually this needs to be enabled.
		res.render('index', { title: 'Login'}	);
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
			req.user.classes.push(doc);
			req.user.save(function (err) {
				if (err) console.log(err);
			});
		});
		
	}
	res.redirect('home');
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
	//sesh.time = time;
	sesh.title = title;
	sesh.description = description;
	var classes = mongoose.model('Class'); 
	var course = classes.findById(course, function (err,doc) {
		console.log(doc);
		sesh.course.push(doc);
		sesh.save(function (err) {
				if (err) console.log(err);
			});
	});
	
//	sesh.save(function (err) {
//		if (!err) {
//			req.user.studytimes.push(this)
//			req.user.save(function (err) {
//				if (err) {console.log(error);}
//			});
//		}
//	});
	
	console.log(time);
}


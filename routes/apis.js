var mongoose = require('mongoose');

exports.user = function(req, res) {
	console.log('getting a user');
	var userId = req.params.id;
	if (!userId) {
		var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
		console.log(userId);
	}
	mongoose.model('User')
	.findById(userId)
	.run(function (err, usr) {
		var rv = {
			'id': userId,
			'name': usr.name,
			'picture': usr.picture,
			'link': usr.link
		}
		res.send(rv)
	});
}

exports.userclasses = function (req, res) {
	var userId = req.params.id;
	if (!userId) {
		var userId = req.user.id;
	}
	mongoose.model('User')
	.findById(userId)
	.populate('classes')
	.run(function (err, usr) {
		res.send(usr.classes)
	});	
}

exports.usersessions = function (req, res) {
	var userId = req.params.id;
	if (!userId) {
		var userId = req.user.id;
	}
	mongoose.model('StudyTime')
	.find({users: userId})
	.populate('classes')
	.run(function (err, studytimes) {
		console.log(studytimes.length)
		console.log(" ")
		res.send(studytimes)
	});	
}

exports.allclasses = function (req, res) {
	mongoose.model('Class').find({}, function(err, courses) {
		res.send(courses);
	});
}

exports.alldepts = function (req, res) {
	mongoose.model('Class').distinct('dept', {}, function(err, depts) {
		res.send(depts);
	});
}
/*
exports.sidebar = function(req, res) {
	var userId = req.user.id
	mongoose.model('User')
	.findById(userId)
	.populate('classes')
	.run(function (err, usr) {
		mongoose.model('StudyTime')
			.find({users: userId})
			.populate('course')
			.run(function (err, studytimes) {
				var classes = []
				var i=0;
				usr.classes.forEach(function(course) {
					classes.push({
						'id': course._id,
						'dept': course.dept,
						'num' : course.num ,
						'name': course.name,
						'sessions': []
					})
					studytimes.forEach(function(sesh) {
						if (sesh.course.equals(course._id)) {
							classes[i]['sessions'].push({
								'id': sesh._id,
								'location': sesh.loc,
								'time': sesh.time,
								'description': sesh.description,
								'title': sesh.title,
								'comments': sesh.comments
							});
						}
					});
					i++;
				});
				var rv = {
					'id': usr._id,
					'name': usr.name,
					'classes': classes
				}
				res.send(rv)
			});
		});
}
*/
exports.seshfeed = function (req, res)
{
	var userId = req.params.id;
	if (!userId) {
		var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
	}
	console.log(userId);
	mongoose.model('User')
		.findById(userId)
		.populate('classes')
		.run(function (err, usr) {
			mongoose.model('StudyTime')
				.find({course: {$in : usr.classes}})
				.sort('created', -1)
				.populate('course',['name','_id'])
				.run(function (err, studyfeeds) {
					res.send(studyfeeds);
				});
			});
		
}

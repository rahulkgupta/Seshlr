var mongoose = require('mongoose');

exports.user = function(req, res) {
	console.log('getting a user');
	var userId = req.params.id;
	if (!userId) {
		console.log("no id");
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
		res.send(JSON.stringify(rv))
	});
}

exports.sidebar = function(req, res) {
	var userId = req.params.id;
	mongoose.model('User')
	.findById(userId)
	.populate('classes')
	.run(function (err, usr) {
		mongoose.model('StudyTime')
			.find({users: userId})
			.populate('classes')
			.run(function (err, studytimes) {
				var classes = []
				usr.classes.forEach(function(course) {
					classes.push({
						'id': course._id,
						'dept': course.dept,
						'num' : course.num ,
						'name': course.name,
						'sessions': []
					})				
				});
				var i=0; // This cannot possibly the most efficient way to do this -- will have to revisit.
				usr.classes.forEach(function(course) {
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
					'classes': classes
				}
				res.send(rv)
			});
		});
}

exports.seshfeed = function (req, res)
{
	var userId = req.params.id;
	if (!userId) {
		console.log("no id");
		var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
		console.log(userId);
	}

	mongoose.model('User')
		.findById(userId)
		.populate('classes')
		.run(function (err, usr) {
			mongoose.model('StudyTime')
				.find({course: {$in : usr.classes}})
				.populate('course',['name','_id'])
				.run(function (err, studyfeeds) {
					console.log(studyfeeds);
					res.send(studyfeeds);
				});
			});
		
}

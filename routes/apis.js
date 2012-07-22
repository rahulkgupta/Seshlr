var mongoose = require('mongoose');

function updateObj(old, update) {
	for (prop in update) {
		if (prop != '_id') {
			console.log(prop + ' ' + typeof(update[prop]))
			if (typeof(update[prop]) == 'object') {
				old[prop] = updateObj(old[prop], update[prop])
				// continue // Need to figure out how to handle this case.
 				/* for (var i=0; i<=update[prop].length; i++) {
					old[prop][i] = updateObj(old[prop][i], update[prop][i])
				} */
			}
			else {
				try {
					old[prop] = update[prop];
				}
				catch(err) { console.log(err); }
			}
		}
	}
}

/***************************
******** GET APIS **********
***************************/
exports.user = function(req, res) {
	var userId = req.params.id;
	if (!userId) {
		var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
	}
	mongoose.model('User')
	.findById(userId)
   .populate('classes')
	.run(function (err, usr) {
		res.send(usr)
	});
}

exports.usersessions = function (req, res) {
	var userId = req.params.id;
	if (!userId) {
		var userId = req.user.id;
	}
	mongoose.model('StudyTime')
	.find({users: userId})
	.populate('course')
	.run(function (err, studytimes) {
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

exports.courses = function (req, res) {
		var num = req.params.num;
		var dept = req.params.dept;
		mongoose.model('Class')
			.find({num:num, dept:dept})
			.run (function (err, courses) {
				res.send(courses)
			})
}

exports.seshfeed = function (req, res) {
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

exports.notifications = function(req, res) {
	// You shouldn't be able to call this API with another users ID.
	var userId = req.user.id
	mongoose.model('Notification')
		.find({users: userId})
		.run(function (err, notifs) {
			res.send(notifs);
		});
}

/***************************
******** POST APIS **********
***************************/

exports.updateUser = function(req,res) {
	var userId = req.user.id;
	var user = req.body;
	mongoose.model('User').findById(userId, function(err, usr) {
		if (err) { res.json({'error': err}, 200) }
		updateObj(usr, user);
		usr.save();
		res.json({'error': null}, 200);
	});
}

exports.addCourse = function (req, res) {
    if (req.loggedIn) {
        mongoose.model('Class')
        .findById(req.body.id)
        .run(function(err, course) {
            console.log(course)
            mongoose.model('User')
                .findById(req.user.id)
                .run(function (err, usr) {
                    if (err) { console.log(err); }
                    else {
                        if (usr.classes.indexOf(course._id) != -1) { // Honestly this can't be ideal.
                            console.log('The user is already enrolled in this class');
                        }
                        else {
                            usr.classes.push(course._id);
                            usr.save(function(err) {
                                if (err) { 
                                	console.log(err);
                                	res.send({'error': 'Could not add class. Try again...'});
                                }
                                else {
                                	res.send({'error' : null});
                              } 
                            });
                        }
                    }
            });
        })
    }
}

var mongoose = require('mongoose');

var classes = mongoose.model('Class'); 
var study = mongoose.model('StudyTime');
var users = mongoose.model('User');
var seshcomment = mongoose.model('SessionComment');
exports.searchCourse = function (department, text, callback) {
	console.log(department);
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);
	classes.find({dept: department, num: regex}, callback);
}
	
exports.createSession = function (session, callback) {
	console.log('adding session');
	var sesh = new study();
	var time = session.time;
	var title = session.title;
	var course = session.course;
	console.log(course);
	var description = session.description;
	var location = session.location;
	//sesh.time = time;
	sesh.title = title;
	sesh.description = description;
	var classes = mongoose.model('Class');
	var userId = this.user.session.userId;
	sesh.course = course;
	sesh.users.push(userId);
	sesh.save(function (err) {
			if (err) console.log(err);
			else {
				callback(sesh);
				everyone.now.distributeSession(sesh);
			}
		});
	var course = classes.findById(course, function (err,doc) {
		sesh.course = doc;
		sesh.users.push(userId);
		//console.log("pushed userId")
		
		
//		user.findById(userId,function(err,usr) {
//			usr.studytimes.push(sesh);
//			usr.save(function (err) {
//				if (err) {console.log(err);}
//				else {
//					// console.log("courses " + sesh)
//					// console.log(usr)
//					
//				}
//			});		

//		});
	});

}

exports.addSession = function (sessionId, callback) {
	var userId = this.user.session.userId;
	study.findById(sessionId, function (err, sesh) {
		sesh.users.push(userId);
		sesh.save(function (err) {
			callback(sesh);
			//gonna need to update the users section for the session if at all.
		})
	});
	
	
}
exports.removeSession = function (sessionid) {
	console.log(sessionid)
	var userID = this.user.session.userId;
	users.findById(userID, function(err, usr) {
		if (err) { console.log(err); }
		else {
			usr.studytimes.id(sessionid).remove()
			usr.save(function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
}

exports.searchDept = function (text, callback) {
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);	
	classes.distinct('dept' , {dept: regex} , callback);
}

exports.submitClass = function (department, classNum, callback) {
	var userID = this.user.session.userId;
	console.log(userID);
	classes.findOne({dept: department, num: classNum}, function (err,course) {
		users.findById(userID, function(err, usr) {
			if (err) { console.log(err); }
			else {
				/* if (usr.classes.indexOf(course)) {
					console.log('The user is already enrolled in this class');
				}
				else { */
					console.log(usr);
					usr.classes.push(course);
					usr.save(function(err) {
						if (err) { console.log(err); }
						else {
							callback(course);
					  }
					});
				// }
			}
		});
	});
}
	
exports.addSessionComment = function (text, author, sessionid) {
	console.log('Adding comment');
	var comment = new seshcomment();
	comment.text = text;
	comment.author = author;
	comment.save(function(err) {
		if (err) {
			console.log(err);
		}
	});
	study.findById(sessionid, function(err, sesh) {
		console.log(sesh);
		// console.log(comment);
		sesh.comments.push(comment);
		sesh.save(function(err) {
			if (err) {
				console.log(err)
			}
			else {
				console.log('Comment added');
				everyone.now.distributeSessionComment(comment, author);
			}
		});
	});	
}

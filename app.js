// Core Modules

var express = require('express')
  , routes = require('./routes')
  , apis = require('./routes/apis.js')

var nowjs = require('now');
var http_request = require('request');

var sys = require('util')
  , fs = require('fs')
  , url = require('url');
var mongoose = require('mongoose');

var cfg = require('konphyg')(__dirname + '/public/config');
var configdata = cfg('config');

var SessionMongoose = require("session-mongoose");
var mongooseSessionStore = new SessionMongoose({
    url: "mongodb://seshly:cactus@ds029797.mongolab.com:29797/sessionstore",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});

var app = module.exports = express.createServer();


// DB Config
var models = require(__dirname+'/models.js');




// Everyauth Config
var everyauth = require('everyauth'),
	Promise = everyauth.Promise;



var user = mongoose.model('User');
var FBFriend = mongoose.model('FBFriend');

function addUser (source, sourceUser) {
	var instance = new user();
	instance._id = sourceUser.id
	instance.name = sourceUser.name;
	instance.first_name = sourceUser.first_name;
	instance.email = sourceUser.email;
	instance.link = sourceUser.link;
	if (source == 'google') {
		instance.picture = sourceUser.link;
	}
	else {
		instance.picture = 'https://graph.facebook.com/' + sourceUser.id + '/picture';
	}
	instance.save();
	return instance;
}
/* 
everyauth.google
  .appId(configdata.appId)
  .appSecret(configdata.appSecret)
  .scope('https://www.googleapis.com/auth/userinfo.profile')
	.findOrCreateUser( function( sess, accessToken, extra, googleUser) {
		var promise = this.Promise();
		googleUser.refreshToken = extra.refresh_token;
		googleUser.expiresIn = extra.expires_in;
		console.log(googleUser.name + ' is attempting to authorize with the site');
		addUser('google', googleUser);
		sess.userId = googleUser.id
		return promise.fulfill(googleUser);
		
  })
  .redirectPath('/home'); */

everyauth.facebook
  .appId(configdata.fbappid)
  .appSecret(configdata.fbappsecret)
  .scope('email, publish_stream')
  .findOrCreateUser( function( sess, accessToken, extra, fbUser) {
  	var promise = this.Promise();
  	console.log(fbUser.name + ' is attempting to authorize with the site');
  	sess.userId = fbUser.id;
  	user.findById(fbUser.id, function(err, usr) {
  		/* if (err) { console.log(err) }
  		else {
  			graphURL = 'https://graph.facebook.com/' + fbUser.id + '/friends';
  			db_friends = FBFriend.find({ user_id: fbUser.id}, 'friend_id', function (err, dbfriends) {
  				console.log(db_freinds);
					http_request.get({url: graphURL, qs: { 'access_token': accessToken }}, function(err, resp, data) {
						data = JSON.parse(data);
						var friends = data.data; // Facebook contains the friends in a list called data X.X
						friends.forEach(function(friend) {
								if (dbfriend.friend_id != friend.id) {
									var instance = new FBFriend;
									instance.friend_id = friend.id;
									instance.name = friend.name;
									instance.user_id = fbUser.id;
									instance.save();
								}
							});
						});
					});
				}); */
  			if (usr) {
  				sess.userExists = true;
  				console.log(fbUser.name + ' already exists -- authenticating now');
  			}
  			else {
  				sess.userExists = false;
  				console.log('Adding new user ' + fbUser.name + ' to the user table');
  				addUser('facebook', fbUser);
  			}
  			promise.fulfill(fbUser);
  		// }
  	});
  	return promise
  })
  .redirectPath('/home');


everyauth.everymodule.findUserById( function (userId, callback) {
  user.findById(userId, callback);
  // callback has the signature, function (err, user) {...}
});
	
// App Config

app.configure('development', function(){
	app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" , key : 'pectus'}));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" , key : 'pectus', store: mongooseSessionStore}));
  app.use(express.errorHandler()); 
});
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
everyauth.helpExpress(app);

// Routes

app.get('/', routes.index)
app.get('/home', routes.home)
app.get('/pande', routes.pande)
app.get('/signup', routes.signup)
app.get('/sessions', routes.sessions)
app.get('/sessions/:id',routes.sessionPage)
app.get('/settings', routes.settings)

// APIs
app.get('/apis/user', apis.user)
app.get('/apis/user/sessions', apis.usersessions)
app.get('/apis/user/sessions/:id', apis.usersessions)
app.get('/apis/user/classes', apis.userclasses)
app.get('/apis/user/classes/:id', apis.userclasses)
app.get('/apis/user/sidebar', apis.sidebar)
app.get('/apis/user/:id', apis.user)
app.get('/apis/seshfeed', apis.seshfeed)
app.get('/apis/seshfeed/:id', apis.seshfeed)
app.get('/apis/allclasses', apis.allclasses)



var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


//nowjs methods

var everyone = nowjs.initialize(app, {cookieKey:'pectus', socketio: {'transports': ["xhr-polling"], 'polling duration': "10" }});


var classes = mongoose.model('Class'); 
var study = mongoose.model('StudyTime');
var users = mongoose.model('User');
var seshcomment = mongoose.model('SessionComment');
everyone.now.searchCourse = function (department, text, callback) {
	console.log(department);
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);
	classes.find({dept: department, num: regex}, callback);
}
	
everyone.now.createSession = function (seshModel, callback) {
	console.log('adding session');
	var sesh = new study();
	var time = seshModel.time;
	var title = seshModel.title;
	var course = seshModel.course;
	console.log(course);
	var description = seshModel.description;
//	var location = seshModel.location;
	sesh.time = time;
	sesh.title = title;
	sesh.description = description;
	sesh.created = seshModel.created
	var classes = mongoose.model('Class');
	var userId = this.user.session.userId;
	sesh.course = course;
	sesh.users.push(userId);
	sesh.save(function (err) {
			if (err) console.log(err);
			else {
				callback(sesh);
				mongoose.model('StudyTime')
				.findById(sesh.id)
				.populate('course')
				.run(function (err, studytime) {
					console.log(studytime)
					everyone.now.distributeSession(studytime);
				});	
			}
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

everyone.now.addSession = function (sessionId, callback) {
	var userId = this.user.session.userId;
	study.findById(sessionId, function (err, sesh) {
		sesh.users.push(userId);
		sesh.save(function (err) {
			callback(sesh);
			//gonna need to update the users section for the session if at all.
		})
	});
	
	
}
everyone.now.removeSession = function (sessionid) {
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

everyone.now.removeCourse = function (courseid, callback) {
	var userID = this.user.session.userId;
	console.log('Attempting to remove course')
	users.findById(userID, function(err, usr) {
		if (err) { console.log(err); }
		else {
			console.log(courseid);
			var pos = usr.classes.indexOf(courseid);
			usr.classes.splice(pos, 1);
			callback(courseid); // For lack of anything more useful to pass back.
		}
	});
}

everyone.now.searchDept = function (text, callback) {
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);	
	classes.distinct('dept' , {dept: regex} , callback);
}

everyone.now.submitDept = function (dept, callback) {
	console.log('Finding course numbers for dept:' + dept);
	classes.distinct('num', {dept: dept}, callback);
}

everyone.now.submitClass = function (department, classNum, callback) {
	var userID = this.user.session.userId;
	console.log(userID);
	classes.findOne({dept: department, num: classNum}, function (err,course) {
		console.log(course)
		users.findById(userID, function(err, usr) {
			if (err) { console.log(err); }
			else {
				if (usr.classes.indexOf(course._id) != -1) { // Honestly this can't be ideal.
					console.log('The user is already enrolled in this class');
					callback(false, 'You&#39;re already enrolled in this course!')
				}
				else { 
					console.log(course);
					console.log(usr);
					usr.classes.push(course._id);
					usr.save(function(err) {
						if (err) { console.log(err); }
						else {
							callback(course);
					  } 
					});
				}
			}
		});
	});
}
	
everyone.now.addSessionComment = function (text, author, sessionid) {
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

//SeshFeed filtering functions

everyone.now.orderByTime = function (callback) {
	userId = this.user.session.userId;
	console.log(userId);
	mongoose.model('User')
		.findById(userId)
		.populate('classes')
		.run(function (err, usr) {
			mongoose.model('StudyTime')
				.find({course: {$in : usr.classes}})
				.sort('time', 1)
				.populate('course',['name','_id'])
				.run(function (err, studyfeeds) {
					callback(studyfeeds);
				});
			});
}


everyone.now.filterByCourse = function (course, callback) {
	console.log(course)
	userId = this.user.session.userId;
	mongoose.model('User')
		.findById(userId)
		.populate('classes')
		.run(function (err, usr) {
			mongoose.model('StudyTime')
				.find({'course': course})
				.populate('course',['name','_id'])
				.run(function (err, studyfeeds) {
					callback(studyfeeds);
				});
			});
}
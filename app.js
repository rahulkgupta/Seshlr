// Core Modules

var express = require('express')
  , routes = require('./routes')
  , apis = require('./routes/apis.js')

var nowjs = require('now');


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

function addUser (source, sourceUser) {
	var instance = new user();
	instance._id = sourceUser.id
	instance.name = sourceUser.name; 
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
  .scope('email')
  .findOrCreateUser( function( sess, accessToken, extra, fbUser) {
  	var promise = this.Promise();
  	console.log(fbUser.name + ' is attempting to authorize with the site');
  	addUser('facebook', fbUser)
  	sess.userId = fbUser.id;
  	return promise.fulfill(fbUser);
  })
  .redirectPath('/home');


everyauth.everymodule.findUserById( function (userId, callback) {
	//console.log(userId);
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

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/pande', routes.pande);
app.get('/addclass', routes.addClass);
// app.get('/add_class/:id', routes.addClass)
app.get('/sessions', routes.sessions)
app.get('/sessions/:id',routes.sessionPage)
// app.post('/create_session', routes.createSession)

// APIs
app.get('/apis/user', apis.user)
app.get('/apis/user/sessions', apis.usersessions)
app.get('/apis/user/sessions/:id', apis.usersessions)
app.get('/apis/user/classes', apis.userclasses)
app.get('/apis/user/classes/:id', apis.userclasses)
app.get('/apis/user/sidebar', apis.sidebar)
app.get('/apis/user/:id', apis.user)
app.get('/apis/seshfeed', apis.seshfeed);
app.get('/apis/seshfeed/:id', apis.seshfeed)



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
	
everyone.now.createSession = function (session, callback) {
	console.log('adding session');
	var sesh = new study();
	var time = session.time;
	var title = session.title;
	var course = session.course;
	console.log(course);
	var description = session.description;
//	var location = session.location;
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

everyone.now.searchDept = function (text, callback) {
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);	
	classes.distinct('dept' , {dept: regex} , callback);
}

everyone.now.submitClass = function (department, classNum, callback) {
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

everyone.now.test = function () {
	alert('test');
}

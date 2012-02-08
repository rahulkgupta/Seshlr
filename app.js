// Core Modules

var express = require('express')
  , routes = require('./routes')

var nowjs = require('now');


var sys = require('util')
  , fs = require('fs')
  , url = require('url');
var mongoose = require('mongoose');

/* Additional Modules */
// DB Config

mongoose.connect('mongodb://seshly:cactus@ds029847.mongolab.com:29847/seshlydb');
var Schema = mongoose.Schema

var StudyTime = new Schema ({
		time 	: Date
	,	loc 	: {
					x : Number
				,	y : Number
		}
	, course: [Class]
	, description : String
	, title	:	String
	, comments: [SessionComment]
});

var User = new Schema ({
		_id: {type: Number, unique: true}	
	,	name: String
	,	link: String
	,	picture: String
	,	refreshToken: String
	, expiresIn: Number
	, classes: [Class]
	, studytimes : [StudyTime]
});

var user = mongoose.model('User', User);

var SessionComment = new Schema ({
		time: Date
	, author: String
	, text: String
});

var studyTime = mongoose.model('StudyTime', StudyTime);

var Class = new Schema ({
    dept  : String
  , num   : String
  , name  : String
});




var sched = mongoose.model('Class',Class); 

// Everyauth Config
var everyauth = require('everyauth'),
	Promise = everyauth.Promise;


function addUser (source, sourceUser) {
	var instance = new user();
	instance._id = sourceUser.id
	instance.name = sourceUser.name; 
	instance.link = sourceUser.link; 
	instance.picture = sourceUser.picture;
	instance.save();
	return instance;
}

everyauth.google
	.appId('1095962159613-6r0npd9s054ddnrncfk3520cek429q03.apps.googleusercontent.com')
	.appSecret('FSVmF-HfoLHTOuhYPEGeIVEC')
  // .appId('1095962159613-0t9btcfjmduba0ii9i92qihb90rj8dh0.apps.googleusercontent.com')
  // .appSecret('4UjKFXYVTvehM0Y_3MG53t34')
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
  .redirectPath('/home');


everyauth.everymodule.findUserById( function (userId, callback) {
	//console.log(userId);
  user.findById(userId, callback);
  // callback has the signature, function (err, user) {...}
});
	
// App Config

var app = module.exports = express.createServer();


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" , key : 'pectus'}));
  app.use(express.methodOverride());
  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
everyauth.helpExpress(app);
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/pande', routes.pande);
app.get('/classes', routes.classes);
// app.get('/add_class/:id', routes.addClass)
app.get('/sessions', routes.sessions)
app.get('/sessions/:id',routes.sessionPage)
// app.post('/create_session', routes.createSession)





var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


//nowjs methods

var everyone = nowjs.initialize(app, {cookieKey:'pectus'} , {socketio: {'transports': ["xhr-polling"], 'polling duration': "10" }});
var classes = mongoose.model('Class'); 
var study = mongoose.model('StudyTime');
var users = mongoose.model('User');
var seshcomment = mongoose.model('SessionComment', SessionComment)
everyone.now.searchCourse = function (department, text, callback) {
	console.log(department);
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);
	classes.find({dept: department, num: regex}, callback);
}

everyone.now.addSession = function (session, callback) {
	console.log('adding session');
	var sesh = new study();
	var time = session.time;
	var title = session.title;
	var course = session.course;
	//console.log(course);
	var description = session.description;
	var location = session.location;
	//sesh.time = time;
	sesh.title = title;
	sesh.description = description;
	var classes = mongoose.model('Class');
	var userId = this.user.session.userId; 
	var course = classes.findById(course, function (err,doc) {
		sesh.course.push(doc);
		sesh.save(function (err) {
				if (err) console.log(err);
		});
		user.findById(userId,function(err,usr) {
			usr.studytimes.push(sesh);
			usr.save(function (err) {
				if (err) {console.log(err);}
				else {
					// console.log("courses " + sesh)
					// console.log(usr)
					callback(sesh);
					everyone.now.distributeSession(sesh);
				}
			});		

		});
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
	classes.findOne({dept: department, num: classNum}, function (err,course) {
		users.findById(userID, function(err, usr) {
			if (err) { console.log(err); }
			else {
				if (usr.classes.indexOf(course)) {
					console.log('The user is already enrolled in this class');
				}
				else {
					usr.classes.push(course);
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

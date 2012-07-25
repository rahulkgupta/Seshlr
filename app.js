// Core Modules

var express = require('express')
  , routes = require('./routes')
  , apis = require('./routes/apis.js')

var http_request = require('request');

var sys = require('util')
  , fs = require('fs')
  , url = require('url');
var mongoose = require('mongoose');

var cfg = require('konphyg')(__dirname + '/public/config');
var configdata = cfg('config');
var bcrypt = require('bcrypt');

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

function addUser (source, sourceUser, sess) {
	var instance = new user();
	instance.fbId = sourceUser.id
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
	instance.save()
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

everyauth.password
	.loginWith('email')
	.getLoginPath('/login')
	.postLoginPath('/login')
	.loginLocals({ 
		title: 'Login',
	})
	.loginView('login.jade')
	.authenticate( function(email, password) {
		var promise = this.Promise();
		console.log(email + ' is attempting to authorize with the site (password)');
		user.findOne({ email: email }, function(err, usr) {
			// We should at the very least use one-way encryption, but we should probably add some sort of salting in here too.
			if (err) {
				console.log(email + ' is attemping to login with an invalid username.')
				promise.fulfill([err])
			}
			bcrypt.compare(password, usr.password, function(err, succ) {
				if (err) {
					console.log(email + ' is attempting to login with an invalid password')
					promise.fulfill(['Invalid Password.']);
				}
				if (succ) {
					console.log(email + ' - authentication successful.');
					promise.fulfill(usr);
				}
				else {
					console.log(email + ' is attempting to login with an invalid password')
					promise.fulfill(['Invalid Password.']);
				}
			});
		});
		return promise
	})
	.loginSuccessRedirect('/')
	.getRegisterPath('/register')
	.postRegisterPath('/register')
	.registerView('register.jade')
	.registerLocals({
		title: 'Register',
	})
	.validateRegistration( function(newUser) {
		// We should add actual validation...
		return null
	})
	.registerUser( function(newUser) {
		// FIXME: Need to add additional details to this user.
		var promise = this.Promise()

		email = newUser.email;
		password = newUser.password;
		delete newUser.password;

		// Generate password hash.
		salt = bcrypt.genSaltSync(10);
		console.log(salt)
		hash = bcrypt.hashSync(password, salt)

		var instance = new user();
		instance.email = email
		instance.password = hash
		instance.save( function(err, usr) {
			if (usr) {
				console.log('Registered new user with email ' + email)
				promise.fulfill(usr)
			}
			else {
				console.log('Registration failed for user with email ' + email)
				promise.fulfill([err])
			}
		});
		return promise;
	})
	.registerSuccessRedirect('/')

everyauth.facebook
  .appId(configdata.fbappid)
  .appSecret(configdata.fbappsecret)
  .scope('email, publish_stream')
  .findOrCreateUser( function( sess, accessToken, extra, fbUser) {
  	var promise = this.Promise();
  	console.log(fbUser.name + ' is attempting to authorize with the site (facebook)');
  	sess.userFbId = fbUser.id;
  	sess.access_token = accessToken;
  	user.findOne({fbId: fbUser.id}, function(err, usr) {
		if (usr) {
			sess.userExists = true;
			console.log(fbUser.name + ' already exists -- authenticating now');
			sess.userId = usr._id
		}
		else {
			sess.userExists = false;
			console.log('Adding new user ' + fbUser.name + ' to the user table');
			var newUser = addUser('facebook', fbUser,sess);
			sess.userId = newUser._id
		}
		promise.fulfill(fbUser);
  	});
  	return promise;
  })
  .redirectPath('/home');

//everyauth.password.userPkey('_id');
everyauth.everymodule.findUserById( function (userId, callback) {
	// FIXME: Not sure if there is an elegant $or query I can use here but this works fine for now.
	// I'm assuming that Mongoose raises the CastError before actually hitting the DB so it's still one round trip.
	try { user.findOne({fbId: userId}, callback); }
	catch (err) { user.findById(userId, callback); }
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
app.get('/settings', routes.settings)
app.get('/pande', routes.pande)
app.get('/signup', routes.signup)
app.get('/sessions', routes.sessions)
app.get('/sessions/:id',routes.sessionPage)
app.get('/test',routes.test)

// APIs
// FIXME: I'd like to break up each of these into their own file if possible (i.e. apis.user.fetch & apis.user.save live in user.js?)
app.get('/apis/user', apis.user)
app.put('/apis/user/:id', apis.updateUser)
app.get('/apis/user/sessions', apis.usersessions)
app.get('/apis/user/sessions/:id', apis.usersessions)
app.get('/apis/user/classes', apis.userclasses)
app.get('/apis/user/classes/:id', apis.userclasses)
app.get('/apis/user/sidebar', apis.sidebar)
app.get('/apis/user/:id', apis.user)
app.post('/apis/course/', apis.addCourse)
app.put('/apis/course/', apis.addCourse)
app.get('/apis/seshfeed', apis.seshfeed)
app.get('/apis/seshfeed/:id', apis.seshfeed)
app.get('/apis/allclasses', apis.allclasses)
app.get('/apis/notifications', apis.notifications)
app.get('/apis/courses/:num/:dept', apis.courses)
app.get('/apis/depts', apis.alldepts)
app.post('/apis/sesh', apis.createsesh)
app.put('/apis/sesh/:id', apis.updatesesh)

var port = process.env.PORT || 4000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


//nowjs methods


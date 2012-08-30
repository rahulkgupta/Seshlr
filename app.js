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

var app = module.exports = express();


// DB Config
var models = require(__dirname+'/models.js');




// Everyauth Config
var everyauth = require('everyauth'),
	Promise = everyauth.Promise;


function addUser (source, sourceUser, access_token, sess) {
    // FIXME: Don't need to store link or picture in the DB since we have UID...
    var user = new User({
        fbId: sourceUser.id,
        name: sourceUser.name,
        first_name: sourceUser.first_name,
        email: sourceUser.email,
        link: sourceUser.link,
        access_token: access_token,
        picture: 'https://graph.facebook.com/' + sourceUser.id + '/picture'
    })
	user.save()
	return user;
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
	.extractExtraRegistrationParams( function (req) {
		return {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
		}
	})
	.authenticate( function(email, password) {
		var promise = this.Promise();
		console.log(email + ' is attempting to authorize with the site (password)');
		User.findOne({ email: email }, function(err, usr) {
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
		if (!(newUser.email && newUser.password && newUser.first_name && newUser.last_name)) {
			return 'Please fill out all the required information.'
		}
		else {
			return null
		}
	})
	.registerUser( function(newUser) {
		// FIXME: Need to add additional details to this user.
		var promise = this.Promise()
		console.log(newUser)
		password = newUser.password;
		delete newUser.password;

		// Generate password hash.
		salt = bcrypt.genSaltSync(10);
		console.log(salt)
		hash = bcrypt.hashSync(password, salt)


        user = new User({
            email: newUser.email,
            first_name: newUser.first_name,
            name: newUser.first_name + ' ' + newUser.last_name,
            password: hash,
        })
		user.save( function(err, usr) {
			if (usr) {
				console.log('Registered new user with email ' + newUser.email)
				promise.fulfill(usr)
			}
			else {
				console.log('Registration failed for user with email ' + newUser.email)
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
  	User.findOne({fbId: fbUser.id}, function(err, usr) {
		if (usr) {
			console.log(fbUser.name + ' already exists -- authenticating now');
		}
		else {
			console.log('Adding new user ' + fbUser.name + ' to the user table');
			var newUser = addUser('facebook', fbUser, accessToken, sess);
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
	try { User.findOne({fbId: userId}, callback); }
	catch (err) { User.findById(userId, callback); }
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
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(routes.error);
});


// Routes
app.get('/', routes.index)
app.get('/home', routes.home)
app.get('/settings', routes.settings)
app.get('/signup', routes.signup)
app.get('/sessions', routes.sessions)
app.get('/sessions/:id',routes.sessionPage)

// APIs
//app.get('/apis/user/:id/', apis.user.getUser)
app.get('/apis/user', apis.user.getUser) // FIXME: Login should return a user object, so client knows their ID.
app.put('/apis/user/:id', apis.user.updateUser)
// app.get('/apis/user/:id/course/', apis.user.getCourses)
// app.post('/apis/user/:id/course/', apis.user.addCourse)
// app.delete('/apis/user/:id/course/:id/', apis.user.removeCourse)
// app.get('/apis/user/:id/sesh/', apis.user.listSeshs) // My Sessions Feed
// app.post('/apis/user/:id/sesh/:id/', apis.user.addSesh)
// app.delete('/apis/user/:id/sesh/:id/', apis.user.removeSesh)
app.get('/apis/sesh', apis.sesh.listSeshs) // Home Sessions Feed
app.post('/apis/sesh', apis.sesh.createSesh)
app.put('/apis/sesh/:id', apis.sesh.updateSesh)
// app.delete('/apis/sesh/:id/', apis.sesh.deleteSesh)
app.get('/apis/course', apis.course.getCourses) // Takes DEPT/NUM parameters

/////
app.get('/apis/user', apis.user.fetch)
app.get('/apis/user/:id', apis.user.fetch)
app.put('/apis/user/:id', apis.user.save)
app.put('/apis/course/', apis.course.create)
app.get('/apis/seshfeed', apis.sesh.all)
app.get('/apis/seshfeed/:id', apis.sesh.all)
app.get('/apis/courses/', apis.course.fetch)
app.post('/apis/sesh', apis.sesh.create)
app.put('/apis/sesh/:id', apis.sesh.save)

// 404
app.get('*', function(req, res) { throw Error('404') })

var port = process.env.PORT || 4000;
server = app.listen(port); // This returns the actual http server
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);

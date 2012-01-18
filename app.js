// Core Modules

var express = require('express')
  , routes = require('./routes')

var sys = require('util')
  , fs = require('fs')
  , url = require('url');
var mongoose = require('mongoose');

/* Additional Modules */
// DB Config

mongoose.connect('mongodb://localhost/peck');
var Schema = mongoose.Schema

var User = new Schema ({
		userID: {type: Number, unique: true}	
	,	name: String
	,	link: String
	,	picture: String
	,	refreshToken: String
	, expiresIn: Number
});

var Class = new Schema ({
    dept  : String
  , num   : String
  , name  : {type: String, unique: true}
});

// Everyauth Config
var everyauth = require('everyauth'),
	Promise = everyauth.Promise;
	
var usersById = {};
var nextUserId = 0;

/* function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
} */

var userID = 0;
var user = mongoose.model('User', User)
var existingUser = true;
function addUser (source, sourceUser) {
	var instance = new user();
	var userData = user.find({ 'userID' : sourceUser.id}, function(err, doc) {
		if (err) {
			console.log(err)
		}
		else {
		 	console.log(doc)
		 	if (doc[0] == null) { existingUser = false; }
		}
	});
	console.log(userData);
	console.log(existingUser)
	if (existingUser == false) {
		instance.userID = sourceUser.id
		instance.name = sourceUser.name; 
		instance.link = sourceUser.link; 
		instance.picture = sourceUser.picture;
		instance.refreshToken = sourceUser.refreshToken;
		instance.expiresIn = sourceUser.expiresIn;	
		instance.save();
		return instance;
	}
	else {
		console.log('User already exists in database')
		return instance;
	}
}

var usersByGoogleId = {};

everyauth.google
  .appId('1095962159613-0t9btcfjmduba0ii9i92qihb90rj8dh0.apps.googleusercontent.com')
  .appSecret('4UjKFXYVTvehM0Y_3MG53t34')
  .scope('https://www.googleapis.com/auth/userinfo.profile')
	.findOrCreateUser( function( sess, accessToken, extra, googleUser) {
		googleUser.refreshToken = extra.refresh_token;
    googleUser.expiresIn = extra.expires_in;
    console.log(googleUser);
    return (usersByGoogleId[googleUser.id] = addUser('google', googleUser) );
  })
  .redirectPath('/home');

/*		
everyauth.google
  .appId('1095962159613-0t9btcfjmduba0ii9i92qihb90rj8dh0.apps.googleusercontent.com')
  .appSecret('4UjKFXYVTvehM0Y_3MG53t34')
  .scope('https://www.googleapis.com/auth/userinfo.profile')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    googleUser.refreshToken = extra.refresh_token;
    googleUser.expiresIn = extra.expires_in;
    console.log(googleUser);
    return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
  })
  .redirectPath('/home'); */
    
// App Config

var app = module.exports = express.createServer();
everyauth.helpExpress(app);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));
  app.use(express.methodOverride());
  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

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

// scraping

var sched = mongoose.model('Class',Class);  
// schedules.start(sched);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

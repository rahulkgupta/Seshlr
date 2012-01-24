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

mongoose.connect('mongodb://localhost/peck');
var Schema = mongoose.Schema

var User = new Schema ({
		userID: {type: Number, unique: true}	
	,	name: String
	,	link: String
	,	picture: String
	,	refreshToken: String
	, expiresIn: Number
	, classes: [Class]
});

var user = mongoose.model('User', User);

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
	instance.userID = sourceUser.id
	instance.name = sourceUser.name; 
	instance.link = sourceUser.link; 
	instance.picture = sourceUser.picture;
	instance.save();
	return instance;
}

everyauth.google
  .appId('1095962159613-0t9btcfjmduba0ii9i92qihb90rj8dh0.apps.googleusercontent.com')
  .appSecret('4UjKFXYVTvehM0Y_3MG53t34')
  .scope('https://www.googleapis.com/auth/userinfo.profile')
	.findOrCreateUser( function( sess, accessToken, extra, googleUser) {
		var promise = this.Promise();
		googleUser.refreshToken = extra.refresh_token;
		googleUser.expiresIn = extra.expires_in;
		console.log(googleUser.name + ' is attempting to authorize with the site');
		addUser('google', googleUser);
		return promise.fulfill(googleUser);
  })
  .redirectPath('/home');


everyauth.everymodule.findUserById( function (userId, callback) {
  User.findById(userId, callback);
  // callback has the signature, function (err, user) {...}
});
	
// App Config

var app = module.exports = express.createServer();
everyauth.helpExpress(app);
var everyone = nowjs.initialize(app);
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
app.get('/classes', routes.classes);

//nowjs methods

var classes = mongoose.model('Class'); 

everyone.now.searchCourse = function (department, text, callback) {
	console.log(department);
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);
	classes.find({dept: department, num: regex}, callback);
}

everyone.now.searchDept = function (text, callback) {
	var regex = new RegExp('\^' + text + '\.*', 'gi');
	console.log(regex);	
	classes.distinct('dept' , {dept: regex} , callback);
}

everyone.now.submitClass = function (department, classNum, callback) {
	classes.findOne({dept: department, num: classNum}, function (err,doc) {
		everyauth.user.classes.push(doc);
		everyauth.user.save(callback);
	});
	
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

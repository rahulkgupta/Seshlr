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
	instance.picture = sourceUser.picture;
	instance.save();
	return instance;
}

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
app.get('/apis/user/:id', apis.user)



var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


//nowjs methods

var everyone = nowjs.initialize(app, {cookieKey:'pectus', socketio: {'transports': ["xhr-polling"], 'polling duration': "10" }});


nowModule = require(__dirname+'/now_module.js');


everyone.now.searchCourse = nowModule.searchCourse;

everyone.now.createSession = nowModule.createSession;

everyone.now.addSession = nowModule.addSession;

everyone.now.removeSession = nowModule.removeSession;

everyone.now.searchDept = nowModule.searchDept;

everyone.now.submitClass = nowModule.submitClass;
	
everyone.now.addSessionComment = nowModule.addSessionComment;

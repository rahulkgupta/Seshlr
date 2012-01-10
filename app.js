
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var sys = require('sys')
  , fs = require('fs')
  , url = require('url');

var app = module.exports = express.createServer();
var auth = require('connect-auth');

// Google OAuth 2.0
var google2Id = "1095962159613-0t9btcfjmduba0ii9i92qihb90rj8dh0.apps.googleusercontent.com"
var google2Secret = "4UjKFXYVTvehM0Y_3MG53t34"
var google2CallbackAddress = "http://localhost:3000/login"

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "anfiahcjandlkandad" }));
  app.use(auth( [
  	auth.Google2({appId : google2Id, appSecret: google2Secret, scope: "https://www.googleapis.com/auth/userinfo.profile", callback: google2CallbackAddress})]) );
  app.use(express.methodOverride());
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
app.get('/authenticate', routes.authenticate);
app.get('/login', routes.login);
app.get('/home', routes.home);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

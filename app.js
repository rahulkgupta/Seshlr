// Main config modules

var express = require('express')
  , routes = require('./routes');

var sys = require('sys')
  , fs = require('fs')
  , url = require('url');

/* Additional Modules */

// Everyauth config
var everyauth = require('everyauth'),
	Promise = everyauth.Promise;
	
var usersById = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
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
}

var usersByGoogleId = {};
var usersByFbId = {};
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
  .redirectPath('/home');

everyauth.facebook.appId('282008641857821')
    .appSecret('305687c5e6ddd93de377e8b5edd2161c')
    .findOrCreateUser( function (session, accessToken, extra, fbUser) {
	  fbUser.refreshToken = extra.refresh_token;
	  fbUser.expiresIn = extra.expires_in;
	  console.log(fbUser);
    return usersByFbId[fbUser.id] ||
        (usersByFbId[fbUser.id] = addUser('facebook', fbUser));
    })
    .redirectPath('/home');
// Configuration

var app = module.exports = express.createServer();

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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

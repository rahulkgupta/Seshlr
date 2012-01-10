var querystring = require('querystring');
var auth = require('connect-auth');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

// Generic authentication routes. Other routes will need to call this with a method and redirect url included (see login)
exports.authenticate = function(req, res){
  req.authenticate([req.param('method')], function(error, authenticated) { 
    if(authenticated ) {
      res.end("<html><h1>Hello Google user:" + JSON.stringify( req.getAuthDetails() ) + ".</h1></html>")
    }
    else {
      res.end("<html><h1>Google authentication failed :( </h1></html>")
    }
   })
};

// Main login page
exports.login = function(req,res) {
var sign_in_link= "/authenticate?method=google2&redirectUrl=" + escape(req.url);
  console.log(req.isAuthenticated());
  if( req.isAuthenticated() ) {
    res.end('<html><body><h1>Signed in with Google</h1></body></html>')
  }
  else {
    res.end('<html><body><a href="'+ sign_in_link + '">Sign in with Google</a></body></html>')
  }
}

// Currently useless
exports.home = function(req, res){
  res.render('home', { title: 'Login Succesful'})
};
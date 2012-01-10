var querystring = require('querystring');
var OAuth= require('oauth').OAuth;

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.login = function(req, res){
  
	var getRequestTokenUrl = "https://www.google.com/accounts/OAuthGetRequestToken";
	
	// GData specifid: scopes that wa want access to
	var gdataScopes = [
		querystring.escape("https://www.googleapis.com/auth/userinfo.profile"),
		querystring.escape("https://www.googleapis.com/auth/userinfo.email")
	];
	
	var oa = new OAuth(getRequestTokenUrl+"?scope="+gdataScopes.join('+'),
	                  "https://www.google.com/accounts/OAuthGetAccessToken",
	                  "1095962159613-0t9btcfjmduba0ii9i92qihb90rj8dh0.apps.googleusercontent.com",
	                  "4UjKFXYVTvehM0Y_3MG53t34",
	                  "1.0",
	                  "http://localhost:3000/login_callback"+( req.param('action') && req.param('action') != "" ? "?action="+querystring.escape(req.param('action')) : "" ),
	                  "HMAC-SHA1");

	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
	  if(error) {
			console.log('error');
	 		console.log(error);
		}
	  else { 
			// store the tokens in the session
			req.session.oa = oa;
			req.session.oauth_token = oauth_token;
			req.session.oauth_token_secret = oauth_token_secret;
		
			// redirect the user to authorize the token
	   	res.redirect("https://www.google.com/accounts/OAuthAuthorizeToken?oauth_token="+oauth_token);
	  }
	})

};

exports.login_callback = function(req, res){
// get the OAuth access token with the 'oauth_verifier' that we received
	
	var oa = new OAuth(req.session.oa._requestUrl,
	                  req.session.oa._accessUrl,
	                  req.session.oa._consumerKey,
	                  req.session.oa._consumerSecret,
	                  req.session.oa._version,
	                  req.session.oa._authorize_callback,
	                  req.session.oa._signatureMethod);
	
    console.log(oa);
	
	oa.getOAuthAccessToken(
		req.session.oauth_token, 
		req.session.oauth_token_secret, 
		req.param('oauth_verifier'), 
		function(error, oauth_access_token, oauth_access_token_secret, results2) {
			
			if(error) {
				console.log('error');
				console.log(error);
	 		}
	 		else {
		
				// store the access token in the session
				req.session.oauth_access_token = oauth_access_token;
				req.session.oauth_access_token_secret = oauth_access_token_secret;

	    		res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/home");
	 		}

	});
};

exports.home = function(req, res){
  res.render('home', { title: 'Login Succesful'})
};
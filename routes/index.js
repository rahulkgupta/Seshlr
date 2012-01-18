var querystring = require('querystring');


exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.home = function(req, res){
  if (req.loggedIn) {
		res.render('home', { title: 'Login Succesful'})
	}
	else {
		res.render('index', { title: 'Pecked up'})
	}
};

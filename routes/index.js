var querystring = require('querystring');


exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.home = function(req, res){
  res.render('home', { title: 'Login Succesful'})
};

exports.pande = function(req, res){
  if (req.loggedIn) {
    console.log(req.user);
    res.render('pande', { 
                         title: 'Pande!'
                          })
  }
  else {
    res.render('fail', {title: 'OH NO!'})  
  }
};

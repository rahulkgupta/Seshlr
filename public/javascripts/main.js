// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
		now: '/nowjs/now',
    text: 'libs/require/text',
    templates: '../templates'
  }

});

require([

  // Load our app module and pass it to our definition function
  'home',
  // Some plugins have to be loaded in order due to their non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
], function(Home){
	now.ready(function(){
		Home.initialize();
	});
	
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  
});

require.config({
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min',
		jui: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
		bs: 'libs/bootstrap/bootstrap',
    text: 'libs/require/text',
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
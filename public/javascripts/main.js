require.config({
    paths: {
        jui: 'libs/jquery/datepicker',  
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone-optamd3-min',
        kalendae: 'libs/kalendae/kalendae',
        bs: 'libs/bootstrap/bootstrap',
        text: 'libs/require/text',
        handlebars: 'libs/handlebars/handlebars',
        templates: '../templates'
    }

});

require([

  // Load our app module and pass it to our definition function
  'app',
  // Some plugins have to be loaded in order due to their non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
], function(App){
    App.initialize();

  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  
});
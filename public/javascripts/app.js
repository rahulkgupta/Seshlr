define([
  'jquery',
  'underscore',
  'backbone',
  'home',
  'settings'
], function($, _, Backbone, Home, Settings){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '': 'home',
      'settings': 'settings',
      // Default
      '*actions': 'peck'

    }, 

    peck: function() {
      console.log("hello")
    }, 

    home: function(){
      console.log("Home")
      Home.initialize();
    },
      
    settings: function(){
      console.log('settings')
      Settings.initialize();
    },
  });

  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
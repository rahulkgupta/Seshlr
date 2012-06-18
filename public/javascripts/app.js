define([
  'jquery',
  'underscore',
  'backbone',
  'home',
  'settingsmain'
], function($, _, Backbone, Home, SMain){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '/': 'home',
      '/settings': 'settings',
      // Default
      '*actions': 'home'
    },
    home: function(){
      Home.initialize();
    },
      
    settings: function(){
      SMain.initialize();
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
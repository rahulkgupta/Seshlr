   define([
   'jquery',
   'underscore',
   'backbone',
   'views/sidebar/sidebarview',
   ], function($  , _, Backbone, sidebarView) {
   var AppRouter = Backbone.Router.extend({

	   routes: {																																																																																																												
	      // Define some URL routes																																																																					
	   	'home': 'home',
	      'settings': 'settings',																								
	      // Default
	      '*actions': 'peck'

	   }, 

      initialize:function () {
        $('.sidebar-container').html(sidebarView.render().el)
    },

	   peck: function() {
	      console.log("hello")
	   }, 

	   home: function(){
	      console.log("Home")
	   },																																						
	      
	   settings: function(){
	      console.log('settings')

	   },
  	});

   var initialize = function(){

    	var app_router = new AppRouter;
    	Backbone.history.start({pushState: true});

   };
  	return {
    	initialize: initialize
   };
});
define([
'jquery',
'underscore',
'backbone',
'views/sidebar/sidebarview',
'views/includes/calendar',
'views/home/seshcreationview'
], function($  , _, Backbone, sidebarView, calendarView, SeshCreation) {
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
      $('#calendar-container').html(calendarView.render())
    },

    peck: function() {
      console.log("hello")
    }, 

    home: function(){
      var seshCreation = new SeshCreation()
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
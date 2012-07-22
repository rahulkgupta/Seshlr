define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar/sidebarview',
    'views/home/home',
    'views/settings/settings',
    'views/signup/signup',
    ], function($  , _, Backbone, SidebarView, HomeView, SettingsView, SignupView) {
    var AppRouter = Backbone.Router.extend({

        routes: {                                                                                                                                                                                                                                                                                                                                                                                                                                                
            // Define some URL routes                                                                                                                                                                                                                                                                                 
            'home': 'home',
            'settings': 'settings',
            'signup': 'signup',                                                                                               
            // Default
            '*actions': 'peck'
        }, 

        initialize:function () {
            var sidebar = new SidebarView({el :  $('.sidebar-container')})
        },

        peck: function() {
        }, 

        home: function(){
            var home = new HomeView({el: $('#main-container')})
        },                                                                                                                                                       
          
        settings: function(){
            var settings = new SettingsView ({el: $('#main-container')})
        },

        signup: function(){
            var signup = new SignupView({el: $('.row')})
        },
    });

    var initialize = function(){
        var store = []
        var app_router = new AppRouter;
        Backbone.history.start({pushState: true});
    };

    return {
        initialize: initialize
   };
});
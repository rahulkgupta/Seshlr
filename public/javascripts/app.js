define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar/sidebarview',
    'views/home/home',
    'views/settings/settings'
    ], function($  , _, Backbone, SidebarView, HomeView, SettingsView) {
    var AppRouter = Backbone.Router.extend({

        routes: {                                                                                                                                                                                                                                                                                                                                                                                                                                                
            // Define some URL routes                                                                                                                                                                                                                                                                                 
            'home': 'home',
            'settings': 'settings',                                                                                               
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
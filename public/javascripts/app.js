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
            $('.sidebar-container').html(SidebarView.render().el)
        },

        peck: function() {
            console.log("hello")
        }, 

        home: function(){
            console.log('home')
            var home = new HomeView({el: $('#main-container')})
        },                                                                                                                                                       
          
        settings: function(){
            var settings = new SettingsView ({el: $('#main-container')})
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
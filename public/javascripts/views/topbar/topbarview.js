define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'text!/templates/topbar/topbar.html'
], function($, _, Backbone, UserModel, 
    template){
    var topbarView = Backbone.View.extend({

        events: {
            'click #topbar-settings' : 'settings',
            'click .brand' : 'home'
            // 'click #topbar-signout' : 'home' TODO Signout logic
        },


        initialize: function () {

            this.user = UserModel.initialize()
            var self = this
            this.user.on("change", function () {
                self.render()
            })
            this.user.fetchUser()
        },

        render: function () {
            var data = {
                _: _,
                $: $,
                user: this.user.get('first_name'),

            };

            var compiledTemplate = _.template( template, data );
            $(this.el).html(compiledTemplate);
            return this
        // this.$('#sidenav-notifications').hide();

        },

        home: function () {
            Backbone.history.navigate('home', true)
        },
        
        settings: function () {
            Backbone.history.navigate('settings', true)
        }

    });;
    
  return topbarView;
});
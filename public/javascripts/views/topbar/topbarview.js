define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'collections/seshfeedcollection',
    'text!/templates/topbar/topbar.html'
], function($, _, Backbone, UserModel, Seshs,
    template){
    var topbarView = Backbone.View.extend({

        events: {
            'click #topbar-settings' : 'settings',
            'click .brand' : 'home'
            // 'click #topbar-signout' : 'home' TODO Signout logic
        },


        initialize: function () {

            this.user = UserModel.initialize()
            this.seshs = Seshs.initialize()
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
            mixpanel.track("Home")
            this.seshs.fetch()
            this.user.clear()
            this.user.fetch()
            Backbone.history.navigate('home', true)
        },

        settings: function () {
            mixpanel.track("Settings")
            this.user.clear()
            this.user.fetch()
            Backbone.history.navigate('settings', true)
        }

    });;
    
  return topbarView;
});

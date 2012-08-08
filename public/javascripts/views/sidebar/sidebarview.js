define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'collections/usernotifscollection',
    'collections/usercoursescollection',
    'collections/userseshscollection',
    'text!/templates/sidebar/sidebar.html'
], function($, _, Backbone, UserModel, userNotifs, Courses, UserSeshs, sidebarTemplate){
    var sidebarView = Backbone.View.extend({

        events: {
            'click #settings' : 'settings',
            'click .logo' : 'home'
        },


        initialize: function () {

            _.bindAll(this);
            this.courses = Courses.initialize();
            this.user = UserModel.initialize()
            this.seshs = UserSeshs.initialize()
            var self = this
            this.user.on("change", function () {
                console.log('change')
                self.courses.reset(self.user.get('classes'))
                self.seshs.reset(self.user.get('seshs'))
                self.render()
            })
            this.user.fetchUser()
            this.notifications = [];
            // this.seshs.on('add', this.render, this)
        },

        render: function () {
            var data = {
                _: _,
                $: $,
                user: this.user,
                seshs: this.seshs.models,
                courses: this.courses.models,
                notifications: [], // FIXME: Add actual notifications
                notif_count: 0, // FIXME: Add notif count
            };

            var compiledTemplate = _.template( sidebarTemplate, data );
            $(this.el).html(compiledTemplate);
            this.$('li#sessions').addClass('selected');
            return this
        // this.$('#sidenav-notifications').hide();

        },

        home: function () {
            Backbone.history.navigate('home', true)
        },

        settings: function () {
            Backbone.history.navigate('settings', true)
        },

        addSesh: function () {
            this.render()
        }
    });;
    
  return sidebarView;
});

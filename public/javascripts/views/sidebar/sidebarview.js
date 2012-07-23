define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
    'collections/usernotifscollection',
  'collections/usercoursescollection',
  'collections/userseshscollection',
  'text!/templates/sidebar/sidebar.html'
], function($, _, Backbone, UserModel, userNotifs, userCrses, UserSeshs, sidebarTemplate){
    var sidebarView = Backbone.View.extend({

        events: {
            'click #settings' : 'settings',
            'click .logo' : 'home'
        },


        initialize: function () {

            _.bindAll(this);
            this.courses = new userCrses;
            this.user = UserModel.initialize()
            this.seshs = UserSeshs.initialize()
            var self = this
            this.user.on("change", function () {
                console.log(self.user)
                self.courses.reset(self.user.get('classes'))
                self.seshs.reset(self.user.get('seshs'))
                self.render()
            })
            this.user.fetch()
            this.notifications = [];
            // this.seshs.on('add', this.render, this)
        },

        render: function () {
            if (this.notifications.models) {
                notif_count = this.notifications.models.length;
            } else {
                notif_count = 0;
            }

            var data = {
                _: _,
                $: $,
                user: this.user,
                seshs: this.seshs.models,
                courses: this.courses.models,
                notifications: this.notifications.models,
                notif_count: this.notifications
            };

            var compiledTemplate = _.template( sidebarTemplate, data );
            $(this.el).html(compiledTemplate);
            return this
        // this.$('li#sessions').addClass('selected');
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

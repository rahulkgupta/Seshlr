define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'collections/usernotifscollection',
    'collections/usercoursescollection',
    'collections/userseshscollection',
    'views/sidebar/sidebarcreateview',
    'views/sidebar/courseview',
    'views/includes/calendar',
    'text!/templates/sidebar/sidebar.html'
], function($, _, Backbone, UserModel, 
    userNotifs, Courses, UserSeshs, 
    SidebarCreateView, courseView, CalendarView,
    sidebarTemplate){
    var sidebarView = Backbone.View.extend({

        events: {
            'click #settings' : 'settings',
            'click .logo' : 'home'
        },


        initialize: function () {

            _.bindAll(this, "render", "renderCourse");
            this.courses = Courses.initialize();
            this.user = UserModel.initialize()
            this.seshs = UserSeshs.initialize()
            var self = this
            this.user.on("change", function () {
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
            var sideCreate = new SidebarCreateView({el: this.$("#sesh-create")})
            this.courses.each(this.renderCourse)
            this.$('li#sessions').addClass('selected');
            var calendar = new CalendarView( {el: $("#calendar")})
            return this
        // this.$('#sidenav-notifications').hide();

        },

        filterSeshs: function (sesh) {
            if (sesh.get('course')._id) {
                return this.id == sesh.get("course") || this.id == sesh.get('course')._id
            }
            return this.id == sesh.get("course")
        },

        renderCourse: function (model) {
            collection = this.seshs.select(this.filterSeshs, model)
            var course = new courseView({model: model,
                                            collection: collection});
            course.render();
            $('#courses').append(course.el);
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

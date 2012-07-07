define([
    'jquery',
    'underscore',
    'backbone',
    'collections/seshfeedcollection',
    'collections/usercoursescollection',
    'models/user',
    'collections/userseshscollection',
    'views/home/seshfeedview',
    'text!/../templates/seshcontainer.html',
    'text!/../templates/seshfeedfilter.html'
], function($, _, Backbone, seshFeedCollection, 
    Courses, User, userSeshCollection, 
    seshFeedView, containerTemplate, 
    feedFilterTemplate){
  
    var SeshFeedView = Backbone.View.extend({

        events: {
            'click #order-time' : 'orderByTime',
            'click #course-filter' : 'toggleCourseFilter',
            'click #course-filter-input' : 'filterByCourse',
            'click #date-filter' : "orderDates",
            'click #time-filter' : "orderTimes",
            'click #user-filter' : "orderUsers",
            'click #comm-filter' : "orderComments",
        },

        initialize: function () {
            _.bindAll(this);
            this.courses = new Courses;
            this.user = User.initialize()
            var self = this
            this.user.on("change", function () {
                self.courses.reset(self.user.get('classes'))
                self.render()
            })
            this.dAscending = true
            this.tAscending = true;
            this.uAscending = true;
            this.cAscending = true;
            this.aIcon = "icon-chevron-up"
            this.dIcon = "icon-chevron-down"
            this.user.fetchUser()
            // this.seshFeed = seshFeedCollection.fetch();
            // this.userSesh = userSeshCollection.fetch();
            // this.render();
        },
        render: function () {
            var data = {
                _: _,
                $: $,
                courses: this.courses.models
            };
            var compiledTemplate = _.template( containerTemplate, data );
            $(this.el).html(compiledTemplate);
            this.seshView = new seshFeedView({el: this.$("#session-feed")})
        },

        addSession: function (event) {
            now.addSession(this.model.id, function(sessiondata) { // Callback with data from the DB.
                //add the session to your current sessions
            });
        },

        addSeshView: function (sesh) {
            this.seshFeed.add(sesh);
            if (!this.userSesh.get(sesh._id)) {
                seshItem = new seshView (this.seshFeed.get(sesh._id), false);
            } else {
                seshItem = new seshView (this.seshFeed.get(sesh._id), true);
            }
            $(this.el).prepend(seshItem.preRender())
        },

        orderByTime: function () {
            var self = this
            now.orderByTime(function (seshs) {
                self.seshView.update(seshs);
            })
        },

        toggleCourseFilter: function () {
            // var course = $('#course-filter-input').val();
            // var self = this
            // console.log(course)
            // now.filterByCourse(course, function (seshs) {
            //  console.log("filtering")
            //  console.log('seshs')

            //  self.seshView.update(seshs);
            //  console.log(self.userSesh)
            // })
            var data = {
                _: _,
                $: $,
                courses: this.courses.models
            };
            var compiledTemplate = _.template( feedFilterTemplate, data )
            console.log('pressed')
            $('#courses').html(compiledTemplate)
          
        },

        filterByCourse: function() {
            var course = $('#course-filter-input').val();
            console.log(this.seshFeed);
            if (course == 0) {
                this.seshView.update(this.seshFeed.models)
            } else {
                var models = _.filter(this.seshFeed.models, function(model) {
                    return model.get('course')._id == course
                })
                this.seshView.update(models);
            }
            this.seshFeed = new seshFeedCollection(express.studyfeeds)
            $('#courses').html("Class")
        },

        orderDates: function() {
            var models;
            if (this.dAscending) {
            models = _.sortBy(this.seshFeed.models, function (model) {
                var date = new Date(model.get('time'))
                return (date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
            })
            $('#date-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                var date = new Date(model.get('time'))
                return -(date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
            })
                $('#date-filter-icon').attr('class',this.dIcon)
            }
            this.seshView.update(models)
            this.dAscending = !this.dAscending;
        },

        orderTimes: function() {
            var models;
            if (this.tAscending) {
                models = _.sortBy(this.seshFeed.models, function (model) {
                var date = new Date(model.get('time'))
                return date.getTime()
            })
            $('#time-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return -(date.getTime())
                })
                $('#time-filter-icon').attr('class',this.dIcon)
            }
            this.seshView.update(models)
            this.tAscending = !this.tAscending;
        },

        orderUsers: function() {
            var models;
            if (this.uAscending) {
            models = _.sortBy(this.seshFeed.models, function (model) {
                return model.get('users').length
            })
            $('#user-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return -(model.get('users').length)
                })
                $('#user-filter-icon').attr('class',this.dIcon)
            }
            this.seshView.update(models)
            this.uAscending = !this.uAscending;
        },

        orderComments: function() {
            var models;
            if (this.cAscending) {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    return model.get('comments').length
                })
                $('#comm-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return -(model.get('comments').length)
                })
                $('#comm-filter-icon').attr('class',this.dIcon)
            }
            this.seshView.update(models)
            this.cAscending = !this.cAscending;
        },
    });

    return SeshFeedView;
});

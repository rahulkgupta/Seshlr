define([
    'jquery',
    'underscore',
    'backbone',
    'collections/seshfeedcollection',
    'collections/usercoursescollection',
    'models/user',
    'collections/userseshscollection',
    'views/home/seshfeedcreationview',
    'views/home/seshview',
    'text!/../templates/seshcontainer.html',
    'text!/../templates/seshfeedcreate.html',
    'text!/../templates/seshfeedfilter.html'
], function($, _, Backbone, seshFeedCollection, 
    Courses, User, userSeshCollection, 
    SeshFeedCreation, seshView, containerTemplate, 
    seshFeedCreateTemplate, feedFilterTemplate){
  
    var SeshContainerView = Backbone.View.extend({

        events: {
            'click #course-filter' : 'toggleCourseFilter',
            'click #course-filter-input' : 'filterByCourse',
            'click #date-filter' : "orderDates",
            'click #time-filter' : "orderTimes",
            'click #user-filter' : "orderUsers",
            'click #comm-filter' : "orderComments",
        },

        initialize: function () {
            this.courses = Courses.initialize();
            this.user = User.initialize()
            this.seshFeed = seshFeedCollection.initialize()
            this.userSeshs = userSeshCollection.initialize()
            var self = this
            this.user.on("change", function () {
                self.courses.reset(self.user.get('classes'))
                self.userSeshs.reset(self.user.get('seshs'))
            })

            this.seshFeed.on('reset', this.render, this)
            this.userSeshs.on('add', function (sesh) {
                self.seshFeed.fetch()
            }, this)
            this.dAscending = true
            this.tAscending = true;
            this.uAscending = true;
            this.cAscending = true;
            this.aIcon = "icon-chevron-up"
            this.dIcon = "icon-chevron-down"
            this.user.fetchUser()
            this.seshFeed.fetch();


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
            // this.seshView = new seshFeedView({el: this.$("#session-feed")})
            if (this.seshFeed.length == 0) {
                console.log('hello')
                var seshFeedCreation = new SeshFeedCreation ({el: this.$("#sesh-create-feed")})
            } else {
                for (var i = 0; i < this.seshFeed.length; i++) {
                    sesh = this.seshFeed.at(i);
                    var sView;
                    if (!this.userSeshs.get(sesh.id)) {
                        sView = new seshView (sesh, false)  
                    } else {
                        sView = new seshView (sesh, true)   
                    }
                    this.$("#session-feed").append(sView.render().el);
                }
            }
                
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



        toggleCourseFilter: function () {
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
            oldFeed = _.clone(this.seshFeed)
            console.log(course);
            if (course == 0) {
                this.seshFeed.reset(this.seshFeed.models)
            } else {
                var models = _.filter(this.seshFeed.models, function(model) {
                    return model.get('course')._id == course
                })
                this.seshFeed.reset(models)
            }
            this.seshFeed = oldFeed
            $('#courses').html("Class")
        },

        orderDates: function() {
            var models;
            if (this.dAscending) {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return (date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
                })
                this.seshFeed.reset(models)
                $('#date-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return -(date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
                })
                this.seshFeed.reset(models)
                $('#date-filter-icon').attr('class',this.dIcon)
            }
            
            this.dAscending = !this.dAscending;
        },

        orderTimes: function() {
            var models;
            if (this.tAscending) {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return date.getTime()
                })
                this.seshFeed.reset(models)
                $('#time-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return -(date.getTime())
                })
                this.seshFeed.reset(models)
                $('#time-filter-icon').attr('class',this.dIcon)
            }
            
            this.tAscending = !this.tAscending;
        },

        orderUsers: function() {
            var models;
            if (this.uAscending) {
            models = _.sortBy(this.seshFeed.models, function (model) {
                return model.get('users').length
            })
            this.seshFeed.reset(models)
            this.$('#user-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return -(model.get('users').length)
                })
                this.seshFeed.reset(models)
                this.$('#user-filter-icon').attr('class',this.dIcon)
            }
            
            this.uAscending = !this.uAscending;
        },

        orderComments: function() {
            var models;
            if (this.cAscending) {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    return model.get('comments').length
                })
                this.seshFeed.reset(models)
                $('#comm-filter-icon').attr('class',this.aIcon)
            } else {
                models = _.sortBy(this.seshFeed.models, function (model) {
                    var date = new Date(model.get('time'))
                    return -(model.get('comments').length)
                })
                this.seshFeed.reset(models)
                $('#comm-filter-icon').attr('class',this.dIcon)
            }
            this.cAscending = !this.cAscending;
        },
    });

    return SeshContainerView;
});

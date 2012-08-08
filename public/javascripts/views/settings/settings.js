define([
    'jquery',             
    'underscore',
    'backbone',
    'bs',
    'handlebars',

    'collections/usercoursescollection',
    'collections/coursescollection',
    'models/user',

    'views/includes/addclass',
    'views/includes/courseview',
    'views/includes/removecourse',

    'text!/templates/settings.html'
],  
function($, _, Backbone, BS, Handlebars, 
         UserCourses, Courses, User, AddClass,
         CourseView, RemoveCourse,
         SettingsTemplate)
{
    var SettingsView = Backbone.View.extend({

        initialize: function () {
            this.courses = new Courses
            this.courses.bind("reset", this.render, this)
            this.courses.fetch({
                data: {depts_only: true}
            })
            this.user = User.initialize()
            this.user.fetch()
            this.userCourses = UserCourses.initialize()
            this.user.on("change", function () {
                console.log(this.user.get('classes'))
                this.userCourses.reset(this.user.get('classes'))
                this.renderUserCourses()
            }, this)
          },

        render: function () {
            depts = []
            this.courses.forEach(function(course) {
                depts.push(course.get('name'))
            });
            var data = {
                depts: depts,
                _: _,
                $: $,
            };
            console.log(depts)
            var compiledTemplate = Handlebars.compile(SettingsTemplate);
            $(this.el).html(compiledTemplate)
            $('#dept-search-input').typeahead().data('typeahead').source = depts;
            var addClass = new AddClass ({el: this.$('#course-selector')})
        },

        renderUserCourses: function () {
            this.$('#user-courses').html('')
            this.userCourses.forEach(this.renderUserCourse, this)
        },

        renderUserCourse: function (course) {
            console.log("hello")
            var removeCourse = new RemoveCourse({
                model: course
            })
            this.$('#user-courses').append(removeCourse.render().el)
        }

    });
      
    return SettingsView;
});

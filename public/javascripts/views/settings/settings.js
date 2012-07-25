define([
    'jquery',             
    'underscore',
    'backbone',
    'bs',
    'handlebars',

    'collections/usercoursescollection',
    'collections/coursescollection',
    'models/user',
    'models/dept',

    'views/includes/courseview',
    'views/includes/removecourse',

    'text!/templates/settings.html'
],  
function($, _, Backbone, BS, Handlebars, 
         UserCourses, Courses, User, Dept,
         CourseView, RemoveCourse,
         SettingsTemplate)
{
    var SettingsView = Backbone.View.extend({

        events: {
            'keyup #dept-search-input' : 'submitDept',
            'keyup #course-search-input' : 'submitNum',
        },
        initialize: function () {
            this.dept = new Dept
            this.dept.bind("change",this.render, this)
            this.dept.fetch()
            this.user = User.initialize()
            var self = this

            this.userCourses = UserCourses.initialize()
            this.courses = new Courses;
            var self = this
            this.user.on("change", function () {
                console.log(self.user.get('classes'))
                self.userCourses.reset(self.user.get('classes'))
                self.renderUserCourses()
            })
            this.user.fetchUser()
            this.courses.on('reset', this.showCourses, this);
            $('#course-search').hide();
            $('#course-submit').hide();
          },

        render: function () {
            console.log('rendering')
            var data = {
                depts: this.dept.get('depts'),
                _: _,
                $: $,
            };

            var depts = this.dept.get('depts')
            
            var compiledTemplate = Handlebars.compile(SettingsTemplate);
            // var html = compiledTemplate(data)
            $(this.el).html(compiledTemplate) 
            $('#dept-search-input').typeahead().data('typeahead').source = depts
            this.renderUserCourses()

        },

        renderUserCourses: function () {
            this.$('#user-courses').html('')
            this.userCourses.forEach(this.renderUserCourse, this)
        },

        submitDept: function(e) {
            if (e.keyCode == 13) {
                var dept = $("#dept-search-input").val();
                now.submitDept(dept, function (err, nums) {
                    $('#course-search').show();
                    var course_input = $('#course-search-input').typeahead();
                    course_input.data('typeahead').source = nums;
                    $("#course-search-input").focus();
                });
            } 
        },

        submitNum: function(e) {
            if (e.keyCode == 13) {
                this.$('#course-container').html('')
                dept = $('#dept-search-input').val();
                num = $('#course-search-input').val();
                // console.log(dept, num)
                this.courses.dept = dept;
                this.courses.num = num;
                this.courses.fetchCourses(num,  dept, {
                    error: function(model, response) { console.log('Add Course Error') },
                    success: function(model, response) { },
                });
            }
        },

        showCourses: function () {
            console.log('showing courses')
            this.userCourses.each(function (course) {
                this.courses.remove(course.id)
            }, this)
            this.courses.each(this.showCourse, this)
        },

        showCourse: function( course) {

            // i/userCourses.get(course.id)) {
            // } else {
               var courseView = new CourseView(
                {
                    model: course
                })
                this.$('#course-container').append(courseView.render().el) 
            // }
            
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

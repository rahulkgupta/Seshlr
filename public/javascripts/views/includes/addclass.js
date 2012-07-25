define([
    'jquery',
    'underscore',
    'backbone',
    'bs',
    'collections/usercoursescollection',
    'collections/coursescollection',
    'models/user',
    'views/includes/courseview'
], function($, _, Backbone,bs, UserCourses, Courses, User, CourseView){
    var searchView = Backbone.View.extend({
        
        events: {
            'keyup #dept-search-input' : 'submitDept',
            'keyup #course-search-input' : 'submitNum',
        },
        
        initialize: function() {
            this.user = User.initialize()
            var self = this

            this.userCourses = new UserCourses;
            this.courses = new Courses;
            var self = this
            this.user.on("change", function () {
                self.userCourses.reset(self.user.get('classes'))
                console.log('change')
            })
            this.user.fetchUser()
            this.courses.bind('reset', this.showCourses, this);
            $('#course-search').hide();
            $('#course-submit').hide();
            
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
                this.courses.reset();
                this.$('#course-container').html('')
                dept = $('#dept-search-input').val();
                num = $('#course-search-input').val();
                this.courses.dept = dept;
                this.courses.num = num;
                this.courses.fetchCourses(num,  dept, {
                    error: function(model, response) { console.log('Add Course Error') },
                    success: function(model, response) { },
                });
            }
        },
      
        removeCourse: function (course) {
            course.clear();
        },

        showCourses: function () {
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

        
    });
  return searchView;
});
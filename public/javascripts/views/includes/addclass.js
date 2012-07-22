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
            this.userCourses = new UserCourses;
            this.courses = new Courses;
            //this.user = User.fetch();
            var self = this
            /*this.user.bind("change", function () {
                self.userCourses.reset(self.user.get('classes'))
            })*/
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
                    success: function(model, response) { alert('success') },
                });
            }
        },
      
        removeCourse: function (course) {
            console.log('removing')
            course.clear();
        },

        showCourses: function () {
            console.log("pecktor")
            this.courses.each(this.showCourse, this)
        },

        showCourse: function( course) {
            var courseView = new CourseView(course)
            this.$('#course-container').append(courseView.render().el)
        },

        submitCourse: function(e) {
            dept = $('#dept-search-input').val();
            num = $('#course-search-input').val();
            now.submitClass(dept, num, function(course, err) {
                if (err) {
                    $('.alert').html(err);
                    $('.alert').addClass('alert-error');
                }
                else {
                    $('.alert').html(course.dept + ' ' + course.num + ' has been added!');
                    $('.alert').addClass('alert-success');
                }       
                $('.alert').show().delay(3000);
                $('.alert').fadeOut(function() {
                    $('#course-selector').css('margin-top', '54px');
                    $('#course-selector').animate({marginTop: 0}, 500);
                $('.alert').removeClass('alert-error');
                $('.alert').removeClass('alert-primary');
                });
            });
        },
        
    });
  return searchView;
});
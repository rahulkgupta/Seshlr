define([
  'jquery',
  'underscore',
  'backbone',
  'bs',
  'collections/coursescollection',
  'views/includes/courseview'
], function($, _, Backbone,bs, courses, CourseView){
	var searchView = Backbone.View.extend({
		el : $('#course-selector'),
		
		events: {
			'keyup #dept-search-input' : 'submitDept',
			'click #course-submit' : 'submitNum'
		},
		
		initialize: function() {
			$('#course-search').hide();
			$('#course-submit').hide();
			courses.bind('reset', this.showCourses, this);
		},
		
		submitDept: function(e) {
			if (e.keyCode == 13) {
				var dept = $("#dept-search-input").val();
				now.submitDept(dept, function (err, nums) {
					$('#course-search').show();
					$('#course-submit').show();
					var course_input = $('#course-search-input').typeahead();
					course_input.data('typeahead').source = nums;
					$("#course-search-input").focus();
				});
			} 
		},

		submitNum: function(e) {
			dept = $('#dept-search-input').val();
			num = $('#course-search-input').val();
			courses.dept = dept;
			courses.num = num;
			courses.fetchCourses(num, dept);
		},
		
		showCourses: function () {
			courses.each(this.showCourse, this)
		},

		showCourse: function (course) {
			console.log(course.get('name'))
			var courseView = new CourseView (course)
			$(this.el).append(courseView.render().el);
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
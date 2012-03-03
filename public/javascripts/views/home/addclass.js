define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
	var searchView = Backbone.View.extend({
		el : '#course-selector',
		
		events: {
			'keyup #dept-search-input' : 'submitDept',
			'click #course-submit' : 'submitCourse'
		},
		
		initialize: function() {
			$('#course-search').hide();
			$('#course-submit').hide();
		},
		
		submitDept: function(e) {
			console.log('test');
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
		
		submitCourse: function(e) {
			dept = $('#dept-search-input').val();
			num = $('#course-search-input').val();
			now.submitClass(dept, num, function(course) {		
				$('.alert').show().delay(3000);
				$('.alert').fadeOut(function() {
					$('#course-selector').css('margin-top', '54px');
					$('#course-selector').animate({marginTop: 0}, 500);
				});
			});
		},
		
	});
  return searchView;
});
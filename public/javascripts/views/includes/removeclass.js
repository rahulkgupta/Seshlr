define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
	var searchView = Backbone.View.extend({
		el : '#course-list',
		
		events: {
			'click .delete' : 'removeClass',
		},
		
		initialize: function(courses) {
			this.courses = courses;
			this.render();
		},
		
		render: function () {
			var courses = this.courses.models;
			courses.forEach(function(course) {
				$('#course-list').append('<li>' + course.get('dept') + ' ' + course.get('num') + '<button data-id="' + course.get('_id') + '" class="delete btn btn-primary">Delete</button></li>');
			});
		},

		removeClass: function (e) {
			var course = e.currentTarget
			var courseID = $(e.currentTarget).data('id');
			console.log(courseID)
			now.removeCourse(courseID, function () {
				$(course).parent().remove();
			});
		}
	});
  return searchView;
});
define([
  'jquery',
  'underscore',
  'backbone',
	'text!/../templates/courseview.html'
], function($, _, Backbone, courseTemplate){
		var CourseView = Backbone.View.extend({


		events: {
			'click #add-course' : 'addCourse',
		},

		initialize: function (course) {
			this.model = course;
		},

		render: function () {

			var data = {
					_: _,
					course: this.model
				};
				var compiledTemplate = _.template( courseTemplate, data );	
				
			this.el.innerHTML = compiledTemplate
			return this
		},

		addCourse: function (event) {
			console.log('test')
			this.model.save();
		},

      clear: function (event) {
         this.el.html('');
      }
		
	});
  return CourseView;
});

define([
  'jquery',
	'jui',
  'underscore',
  'backbone',
	'bsmodal',
	'models/seshcreate',
	'collections/usercoursescollection',
	'text!templates/seshcreate.html'
], function($, Jui, _, Backbone, bs, seshCreateModel, userCrss, seshcreationTemplate){
	var SeshCreationView = Backbone.View.extend ({

		el: "#session-creation",
	
		events: {
			'click #create-sesh' : 'showSeshCreation',
			'click #submit-sesh'	: 'submitSeshCreation'

		},

		initialize: function(courses, userSeshs){
			this.model = new seshCreateModel;
			this.courses = courses;
			this.userSeshs = userSeshs;
			this.render();
		},

		showSeshCreation: function (event) {
			$('#sesh-form').modal()
			$('#time-input').datepicker();
		},
		
		render: function () {
			var data = {
				_: _,
				courses: this.courses.models
			};
			var compiledTemplate = _.template( seshcreationTemplate, data );
			$("#session-creation").append(compiledTemplate);

		},

		submitSeshCreation: function (event) {
			var day = $('#time-input').val();
			var today = new Date();
			var dayformatted = day.slice(6) + '-' + day.slice(0,2) + '-' + day.slice(3,5);
			var hour = $('#hour-pick').val();
			var halfday = $('#halfday-pick').val();
			var datestring = new String(dayformatted + 'T' + hour + ':00Z');
			var course = $('#select-course-input').val();
			var title = $('#title-input').val();
			var description = $('#description-input').val();
			if (title && day - today > 0) {
				$('#sesh-form').modal("hide")
				var self = this;
				this.model.set({time: datestring, course: course, title: title, location: location, description: description});
				now.createSession(this.model, function(sesh) {
					self.userSeshs.add(sesh);
					console.log(self.userSeshs.get(sesh._id))
				});
			} else {
				console.log('you pecked up')			
			}
		}
	});
			

  return SeshCreationView;
});

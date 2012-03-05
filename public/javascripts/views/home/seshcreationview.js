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
			'click #submit-sesh'	: 'submitSeshCreation',
			'submit #create-sesh-form' : 'submitSeshCreation'
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
			var day = $('#time-input').datepicker('getDate');

			var today = new Date();
			console.log(today)
			var daystring = $('#time-input').val();
			var hour = $('#hour-pick').val();
			console.log(hour)
			var hr = hour.split(':')
			var course = $('#select-course-input').val();
			var title = $('#title-input').val();
			var description = $('#description-input').val();
			if (title && day && day > today) {
				day.setHours(hr[0],hr[1])
				$('#sesh-form').modal("hide")
				var self = this;
				this.model.set({time: day, created: today, course: course, title: title, location: location, description: description});
				now.createSession(this.model, function(sesh) {
					self.userSeshs.add(sesh);
					console.log(sesh.id)
					location.href='/sessions/' + sesh._id
				});
			} else {
				$("#title-form").attr("class", "control-group")
				$("#date-form").attr("class", "control-group")
				$('#title-error').text('')
				$('#date-error').text('')
				if (!title) {
					$("#title-form").attr("class", "control-group error")
					$('#title-error').text('Please enter a title.')
				}
				if  (!day || day - today <= 0) {
					$("#date-form").attr("class", "control-group error")
					$('#date-error').text('Please provide a date in the future.')
				}
				
			}
		}
	});
			

  return SeshCreationView;
});

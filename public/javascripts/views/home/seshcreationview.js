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

		initialize: function(){
			this.model = new seshCreateModel;
			this.courses = new userCrss;
			this.courses.bind('reset',this.render, this);
			this.courses.fetch();
		
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
			$(this.el).append(compiledTemplate);

		},

		submitSeshCreation: function (event) {
			$('#sesh-form').modal("hide")
			var day = $('#time-input').val();
			var dayformatted = day.slice(6) + '-' + day.slice(0,2) + '-' + day.slice(3,5);
			var hour = $('#hour-pick').val();
			var halfday = $('#halfday-pick').val();
			var datestring = new String(dayformatted + 'T' + hour + ':00Z');
			var course = $('#select-course-input').val();
			var title = $('#title-input').val();
			var description = $('#description-input').val();
			this.model.set({time: datestring, course: course, title: title, location: location, description: description});
			now.createSession(this.model, function(sessiondata) { // Callback with data from the DB.
				// $('.mysessions').append('<a href="sessions/' + sessiondata._id + '"> <p>' + sessiondata.title + '</p></a>');
			});
		}
	});

  return SeshCreationView;
});

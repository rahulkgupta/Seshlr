define([
  'jquery',
  'underscore',
  'backbone',
	'models/seshcreate'
], function($, _, Backbone, seshCreateModel){
	var SeshCreationView = Backbone.View.extend ({

		el: "#session-creation",
	
		events: {
			'click #create-session' : 'showSessionCreation',
			'click #submit-session'	: 'submitSessionCreation'

		},

		initialize: function(){
			this.model = new seshCreateModel;
		
		},

		showSessionCreation: function (event) {
			$('#select-course').show();
			$('#time').show();
			$('#title').show();
			$('#location').show();
			$('#description').show();
			$('#submit-session').show();
		
		},

		submitSessionCreation: function (event) {
			var day = $('#time-input').val();
			var dayformatted = day.slice(6) + '-' + day.slice(0,2) + '-' + day.slice(3,5);
			var hour = $('#hour-pick').val();
			var halfday = $('#halfday-pick').val();
			var datestring = new String(dayformatted + 'T' + hour + ':00Z');
			var course = $('#select-course-input').val();
			var title = $('#title-input').val();
			var location = $('#location-input').val();
			var description = $('#description-input').val();
			this.model.set({time: datestring, course: course, title: title, location: location, description: description});
			now.createSession(this.model, function(sessiondata) { // Callback with data from the DB.
				// $('.mysessions').append('<a href="sessions/' + sessiondata._id + '"> <p>' + sessiondata.title + '</p></a>');
			});
		}
	});

  return SeshCreationView;
});

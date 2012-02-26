define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
	'collections/usercoursescollection',
	'collections/userseshscollection',
	'text!templates/sidebar/sidebar.html'
], function($, _, Backbone, userData, userCrses, userSshs, sidebarTemplate){
	var sidebarView = Backbone.View.extend({
		el: $(".sidebar-container"),
		
		events: {
			'click li#sessions' : 'tabSesh',
			'click li#notifications'	: 'tabNotes'

		},
		
		initialize: function (userData, courses, userSeshs) {
			this.user = userData;
			this.seshs = userSeshs;
			this.courses = courses;
			this.seshs.bind('add', this.addSesh, this)
			this.render();
		},
		render: function () {
			var data = {
				_: _,
				$: $,
				user: this.user,
				seshs: this.seshs.models,
				courses: this.courses.models
			};
			var compiledTemplate = _.template( sidebarTemplate, data );
			$(this.el).append(compiledTemplate)
			
			$('li#sessions').addClass('selected');
			$('#sidenav-notifications').hide();
		},
		
		tabSesh: function() {
			$('li#notifications').removeClass('selected');
			$('li#sessions').addClass('selected');
			$('#sidenav-notifications').hide();
			$('#sidenav-sessions').show();
		},
		
		tabNotes: function() {
			$('li#sessions').removeClass('selected');
			$('li#notifications').addClass('selected');
			$('#sidenav-sessions').hide();
			$('#sidenav-notifications').show();
		},
		
		addSesh: function(sesh) {
			$("#" + sesh.get('course')).append('<div> blah </div>')
		}
 
	});
  return sidebarView;
});

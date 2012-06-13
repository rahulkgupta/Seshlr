define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  	'collections/usernotifscollection',
	'collections/usercoursescollection',
	'collections/userseshscollection',
	'text!/templates/sidebar/sidebar.html'
], function($, _, Backbone, userData, userNotifs, userCrses, userSshs, sidebarTemplate){
	var sidebarView = Backbone.View.extend({
		el: $(".sidebar-container"),
		
		events: {
			'click li#sessions' : 'tabSesh',
			'click li#notifications'	: 'tabNotes'

		},
		
		initialize: function (userData, userNotifs, courses, userSeshs) {
			console.log(userData)
			this.user = userData;
			this.notifications = userNotifs;
			this.seshs = userSeshs;
			this.courses = courses;
			this.seshs.bind('add', this.addSesh, this)
			this.render();
		},
		render: function () {
			if (this.notifications.models) {
				notif_count = this.notifications.models.length;
			} else {
				notif_count = 0;
			}
			console.log(this.user)
			var data = {
				_: _,
				$: $,
				user: this.user,
				seshs: this.seshs.models,
				courses: this.courses.models,
				notifications: this.notifications.models,
				notif_count: notif_count
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
			//make a template that will have the sesh info and then just put the compiled template 
			$("#" + sesh.get('course')).append('<div> blah </div>')
		}
 
	});
  return sidebarView;
});

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
		
		initialize: function () {
			this.user = new userData;
			this.user.fetch();
			this.seshs = new userSshs;
			this.courses = new userCrses;
			this.courses.bind('reset',this.render, this);
			var self = this;
			this.seshs.fetch({success: function() {
					self.courses.fetch();
				}
			});
		},
		render: function () {
			console.log(this.seshs.models);
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

		}
 
	});
  return sidebarView;
});

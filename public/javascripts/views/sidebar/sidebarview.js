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

		events: {
         'click #settings' : 'settings'
		},


     

		render: function () {
			// if (this.notifications.models) {
			// 	notif_count = this.notifications.models.length;
			// } else {
			// 	notif_count = 0;
			// }
         // console.log(this.user.get('name'))
			var data = {
				_: _,
				$: $,
				// user: this.user,
				// seshs: this.seshs.models,
				// courses: this.courses.models,
				// notifications: this.notifications.models,
				// notif_count: notif_count
			};
			var compiledTemplate = _.template( sidebarTemplate, data );
			$(this.el).html(compiledTemplate);
			// $('li#sessions').addClass('selected');
			// $('#sidenav-notifications').hide();
         return this;
		},

       settings: function () {
         console.log("hello")
         Backbone.history.navigate('settings', true)
      },
   });;
		
  return new sidebarView;
});

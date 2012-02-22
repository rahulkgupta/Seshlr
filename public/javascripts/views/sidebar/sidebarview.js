define([
  'jquery',
  'underscore',
  'backbone',
	'collections/usercoursescollection',
	'collections/userseshscollection',
	'text!templates/sidebar/sidebar.html'
], function($, _, Backbone, userCrses, userSshs, sidebarTemplate){
	var sidebarView = Backbone.View.extend({
		el: $(".sidebar-container"),
		initialize: function () {
			this.seshs = userSshs;
			this.courses = userCrses;
			this.courses.bind('reset',this.render, this);
			this.seshs.fetch();
			this.courses.fetch();
		},
		render: function () {

			var data = {
				_: _,
				courses: this.courses
			};
			var compiledTemplate = _.template( sidebarTemplate, data );
			$(this.el).append(compiledTemplate)
		},
		
		addSesh: function(sesh) {

		}
 
	});
  return sidebarView;
});

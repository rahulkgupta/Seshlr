define([
  'jquery',
  'underscore',
  'backbone',
	'collections/seshfeedcollection',
	'collections/userseshscollection',
	'views/home/seshview',
	'text!templates/seshfeed.html'
], function($, _, Backbone, seshFeedCollection, userSeshCollection, seshView, seshFeedTemplate){
	var SeshFeedView = Backbone.View.extend({
		el: $("#session-feed"),
		initialize: function (courses,userSeshs,seshFeed) {
			this.courses = courses
			this.seshFeed = seshFeed
			this.userSesh = userSeshs
			var self = this;
			this.render();
		},
		render: function () {
				for (var i = 0; i < this.seshFeed.length; i++) {
					sesh = this.seshFeed.at(i);
					var sesh;
					if (!this.userSesh.get(sesh.id)) {
						sesh = new seshView (sesh, false)	
					} else {
						sesh = new seshView (sesh, true)	
					}
					sesh.render();
				}
		},

		addSession: function (event) {
			now.addSession(this.model.id, function(sessiondata) { // Callback with data from the DB.
				//add the session to your current sessions
			});
		},

		addSeshView: function (sesh) {
			this.seshFeed.add(sesh);
			if (!this.userSesh.get(sesh._id)) {
				seshItem = new seshView (this.seshFeed.get(sesh._id), false);
			} else {
				seshItem = new seshView (this.seshFeed.get(sesh._id), true);
			}
			$(this.el).prepend(seshItem.preRender())
		}

	});
  return SeshFeedView;
});

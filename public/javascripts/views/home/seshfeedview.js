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
		initialize: function () {
			this.seshFeed = new seshFeedCollection;
			this.userSesh = new userSeshCollection;
			this.seshFeed.bind('reset',this.render, this);
			var self = this;
			this.userSesh.fetch({success: function() {
					self.seshFeed.fetch();
				}});
			
		},
		render: function () {
				for (var i = 0; i < this.seshFeed.length; i++) {
					sesh = this.seshFeed.at(i);
					console.log(sesh)
					var sesh;
					console.log(this.userSesh.get(sesh.id))
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
			this.collection.add(sesh, {at: 0})
			this.remove();
			this.render();
		}

	});
  return SeshFeedView;
});

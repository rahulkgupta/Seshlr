define([
  'jquery',
  'underscore',
  'backbone',
	'views/home/seshview',
], function($, _, Backbone, seshView){
	var SeshFeedView = Backbone.View.extend({

		el: $("#session-feed"),

		initialize: function (courses,userSeshs,seshFeed) {
			this.courses = courses
			this.seshFeed = seshFeed
			this.userSesh = userSeshs
			var self = this;
			this.seshFeed.bind('reset',this.render,this)
		},
		render: function () {
			for (var i = 0; i < this.seshFeed.length; i++) {
				sesh = this.seshFeed.at(i);
				var sView;
				if (!this.userSesh.get(sesh.id)) {
					sView = new seshView (sesh, false)	
				} else {
					sView = new seshView (sesh, true)	
				}
				sView.render();
			}
		},

		update:function (seshs) {
			$(this.el).empty()
			this.seshFeed.reset(seshs)
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
		},

		orderByTime: function () {
			var self = this
			now.orderByTime(function (seshs) {
				console.log(seshs)
				$('#sesh-feed-data').remove();
				self.userSesh.reset(seshs);
				console.log(self.userSesh)
			})
		}

	});
  return SeshFeedView;
});


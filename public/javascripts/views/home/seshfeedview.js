define([
  	'jquery',
  	'underscore',
  	'backbone',
  	'collections/seshfeedcollection',
    'collections/usercoursescollection',
    'models/user',
    'collections/userseshscollection',
	'views/home/seshview',
], function($, _, Backbone, SeshFeed, UserCourses, User, UserSeshs, seshView){
	var SeshFeedView = Backbone.View.extend({


		initialize: function () {
			_.bindAll(this, "render");
			this.courses = new UserCourses;
            this.user = User.fetch()
            var self = this
            this.user.bind("change", function () {
                self.courses.reset(self.user.get('classes'))
            })
            this.seshFeed = SeshFeed.fetch();
            this.userSesh = UserSeshs.fetch();
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
				$(this.el).append(sView.render().el);
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
		}

	});
  return SeshFeedView;
});


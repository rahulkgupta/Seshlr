define([
  'jquery',
  'underscore',
  'backbone',
	'collections/seshfeedcollection',
	'collections/userseshscollection',
	'views/home/seshfeedview',
	'text!templates/seshfeed.html',
	'text!templates/seshfeedfilter.html'
], function($, _, Backbone, seshFeedCollection, userSeshCollection, seshFeedView, seshFeedTemplate, feedFilterTemplate){
	var SeshFeedView = Backbone.View.extend({
		el: ".sesh-filters",

		events: {
			'click #order-time' : 'orderByTime',
			'click #course-filter' : 'filterByCourse'
		},

		initialize: function (courses,userSeshs,seshFeed) {
			this.courses = courses
			this.seshFeed = seshFeed
			this.userSesh = userSeshs
			this.seshView = new seshFeedView(this.courses, this.userSesh,this.seshFeed)
			console.log($(this.el).html())
			var self = this;
			this.render();
		},
		render: function () {
			var data = {
				_: _,
				$: $,
				courses: this.courses.models
			};
			this.seshView.render();
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
				
				self.seshView.update(seshs);
				console.log(self.userSesh)
			})
		},

		filterByCourse: function () {
			// var course = $('#course-filter-input').val();
			// var self = this
			// console.log(course)
			// now.filterByCourse(course, function (seshs) {
			// 	console.log("filtering")
			// 	console.log('seshs')
				
			// 	self.seshView.update(seshs);
			// 	console.log(self.userSesh)
			// })
			var data = {
				_: _,
				$: $,
				courses: this.courses.models
			};
			var compiledTemplate = _.template( feedFilterTemplate, data )
			console.log('pressed')
			$('#courses').html(compiledTemplate)
		}

	});
  return SeshFeedView;
});

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
			'click #course-filter' : 'toggleCourseFilter',
			'click #course-filter-input' : 'filterByCourse',
			'click #date-filter' : "orderDates",
			'click #time-filter' : "orderTimes",
			'click #user-filter' : "orderUsers",
			'click #comm-filter' : "orderComments",
		},

		initialize: function (courses,userSeshs,seshFeed) {
			this.courses = courses
			this.dAscending = true
			this.tAscending = true;
			this.uAscending = true;
			this.cAscending = true;
			this.aIcon = "icon-chevron-up"
			this.dIcon = "icon-chevron-down"
			this.seshFeed = new seshFeedCollection(express.studyfeeds)
			this.userSesh = userSeshs
			this.seshView = new seshFeedView(this.courses, this.userSesh,this.seshFeed)
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

		toggleCourseFilter: function () {
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
			
		},

		filterByCourse: function() {
			var course = $('#course-filter-input').val();
			console.log(this.seshFeed);
			if (course == 0) {
				this.seshView.update(this.seshFeed.models)
			} else {
				var models = _.filter(this.seshFeed.models, function(model) {
					return model.get('course')._id == course
				})
				this.seshView.update(models);
				
			}
			this.seshFeed = new seshFeedCollection(express.studyfeeds)
			$('#courses').html("Class")
		},

		orderDates: function() {
			var models;
			if (this.dAscending) {
			 models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return (date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
			 })
			 $('#date-filter-icon').attr('class',this.aIcon)
			} else {
				models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return -(date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
			 })
				$('#date-filter-icon').attr('class',this.dIcon)
			}
			this.seshView.update(models)
			this.dAscending = !this.dAscending;

		},

		orderTimes: function() {
			var models;
			if (this.tAscending) {
			 models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return date.getTime()
			 })
			 $('#time-filter-icon').attr('class',this.aIcon)
			} else {
				models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return -(date.getTime())
			 })
				$('#time-filter-icon').attr('class',this.dIcon)
			}
			this.seshView.update(models)
			this.tAscending = !this.tAscending;
		},

		orderUsers: function() {
			var models;
			if (this.uAscending) {
			 models = _.sortBy(this.seshFeed.models, function (model) {
			 		 return model.get('users').length
			 })
			 $('#user-filter-icon').attr('class',this.aIcon)
			} else {
				models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return -(model.get('users').length)
			 })
				$('#user-filter-icon').attr('class',this.dIcon)
			}
			this.seshView.update(models)
			this.uAscending = !this.uAscending;
		},

		orderComments: function() {
			var models;
			if (this.cAscending) {
			 models = _.sortBy(this.seshFeed.models, function (model) {
			 		 return model.get('comments').length
			 })
			 $('#comm-filter-icon').attr('class',this.aIcon)
			} else {
				models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return -(model.get('comments').length)
			 })
				$('#comm-filter-icon').attr('class',this.dIcon)
			}
			this.seshView.update(models)
			this.cAscending = !this.cAscending;
		},
	});
  return SeshFeedView;
});

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
			'click #date-filter' : "orderDates"
		},

		initialize: function (courses,userSeshs,seshFeed) {
			this.courses = courses
			this.ascending = true
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
			var models
			if (this.ascending) {
			 models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return (date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
			 })
			 $('#date-filter-icon').attr('class',"icon-chevron-up")
			} else {
				models = _.sortBy(this.seshFeed.models, function (model) {
			 		 var date = new Date(model.get('time'))
			 		 return -(date.getDate() + date.getMonth()*100 + date.getFullYear()*1000)
			 })
				$('#date-filter-icon').attr('class',"icon-chevron-down")
			}
			this.seshView.update(models)
			this.ascending = !this.ascending;

		}

	});
  return SeshFeedView;
});

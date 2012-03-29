define([
  'jquery',
  'underscore',
  'backbone',
	'models/user',
	'models/seshfeed',
	'collections/usernotifscollection',
	'collections/usercoursescollection',
	'collections/userseshscollection',
	'collections/seshfeedcollection',
	'views/home/seshcontainerview',
	'views/includes/addclass',
	'views/includes/calendar',
	'views/sidebar/sidebarview',
	'views/home/seshcreationview'
], function($, _, Backbone, userData, sFeed, userNotifs, userCrses, userSshs, seshFeedCollection, sfView, SearchDepts, Calendar, sidebarView, CreateSesh){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		Backbone.Model.prototype.idAttribute = "_id";
		var seshFeed = new seshFeedCollection(express.studyfeeds);
		var user = new userData(express.user)
		var courses = new userCrses(express.courses);
		var userSeshs = new userSshs(express.userSeshs);
		var notifs = new userNotifs(express.userNotifs);
		var searchView = new SearchDepts;
		var calendarView = new Calendar;
		// courses.add(express.courses[0])
		// courses.add(express.courses[1])

		console.log(userSeshs.at(0))
		var sidebar = new sidebarView(notifs, user, courses, userSeshs);
		var createSesh = new CreateSesh(courses, userSeshs, user);
		var seshContainerView = new sfView(courses,userSeshs,seshFeed);
		now.distributeSession = function (sesh) {
			seshFeedView.addSeshView(sesh);
		};

  }

  return {
    initialize: initialize
  };
});

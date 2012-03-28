// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'models/user',
	'models/seshfeed',
	'collections/usercoursescollection',
	'collections/userseshscollection',
	'collections/seshfeedcollection',
	'views/home/seshcontainerview',
	'views/includes/addclass',
	'views/sidebar/sidebarview',
	'views/home/seshcreationview'
], function($, _, Backbone, userData, sFeed,userCrses, userSshs, seshFeedCollection, sfView, SearchDepts, sidebarView, CreateSesh){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		Backbone.Model.prototype.idAttribute = "_id";
		var seshFeed = new seshFeedCollection(express.studyfeeds);
		var user = new userData(express.user)
		var courses = new userCrses(express.courses);
		var userSeshs = new userSshs(express.userSeshs);
		// courses.add(express.courses[0])
		// courses.add(express.courses[1])
		console.log(userSeshs.at(0))
		console.log(userSeshs)
		var sidebar = new sidebarView(user, courses, userSeshs);
		//var createSesh = new CreateSesh(courses, userSeshs, user);
		//var seshContainerView = new sfView(courses,userSeshs,seshFeed);
		now.distributeSession = function (sesh) {
			seshFeedView.addSeshView(sesh);
		};

	
  }

  return {
    initialize: initialize
  };
});

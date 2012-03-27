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
		var searchView = new SearchDepts;
		// courses.add(express.courses[0])
		// courses.add(express.courses[1])

  }

  return {
    initialize: initialize
  };
});

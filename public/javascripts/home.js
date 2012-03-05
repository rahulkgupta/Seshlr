// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'models/user',
	'collections/usercoursescollection',
	'collections/userseshscollection',
	'collections/seshfeedcollection',
	'views/home/seshcontainerview',
	'views/home/addclass',
	'views/sidebar/sidebarview',
	'views/home/seshcreationview'
], function($, _, Backbone, userData, userCrses, userSshs, seshFeedCollection, sfView, SearchDepts, sidebarView, CreateSesh){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		Backbone.Model.prototype.idAttribute = "_id";

		var user = new userData;
		var courses = new userCrses;
		var userSeshs = new userSshs;
		var searchView = new SearchDepts;
		var seshFeed = new seshFeedCollection();
		user.fetch({success: function () {
			courses.fetch({success: function () {
				userSeshs.fetch({success:function () {
					seshFeed.fetch({success:function() {
						console.log(userSeshs.at(0))
						var sidebar = new sidebarView(user, courses, userSeshs);
						var createSesh = new CreateSesh(courses, userSeshs);
						var seshContainerView = new sfView(courses,userSeshs,seshFeed);
						now.distributeSession = function (sesh) {
							seshFeedView.addSeshView(sesh);
						};
					}})
				}})
			}})
		}});
	
  }

  return {
    initialize: initialize
  };
});

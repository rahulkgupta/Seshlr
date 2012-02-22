// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'views/home/userview',
	'views/home/seshfeedview',
	'views/courses/searchdepts',
	'views/sidebar/sidebarview',
	'views/home/seshcreationview'
], function($, _, Backbone, uView,sfView, SearchDepts, sidebarView, CreateSesh){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
	
		var userView = new uView;
		var searchview = new SearchDepts;
		var createSesh = new CreateSesh;
		var sidebar = new sidebarView;
		var seshFeedView = new sfView;


		now.distributeSession = function (sesh) {
			sidebarView.addSesh(sesh);
		}
  }

  return {
    initialize: initialize
  };
});

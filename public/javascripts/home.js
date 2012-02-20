// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'views/home/userview',
	'views/home/seshfeedview',
	'views/courses/searchdepts',
	'views/sidebar/sidebar'
], function($, _, Backbone, uView,sfView, SearchDepts, sidebarView){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		var userView = new uView;
		var seshFeedView = new sfView;
		var searchview = new SearchDepts;
		var sidebarView = new sidebarView;
		
  }

  return {
    initialize: initialize
  };
});

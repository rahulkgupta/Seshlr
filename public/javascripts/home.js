// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'views/home/userview',
	'views/home/seshfeedview',
	'views/courses/searchdepts'
], function($, _, Backbone, uView,sfView, SearchDepts){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		var userView = new uView;
		var seshFeedView = new sfView;
		var searchview = new SearchDepts;
		
  }

  return {
    initialize: initialize
  };
});

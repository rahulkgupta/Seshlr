// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'views/home/userview',
	'views/home/seshfeedview',
	'views/courses/searchdepts',
	'views/home/seshcreationview'
], function($, _, Backbone, uView,sfView, SearchDepts, CreateSesh){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		var userView = new uView;
		var seshFeedView = new sfView;
		var searchview = new SearchDepts;
		var createSesh = new CreateSesh;
  }

  return {
    initialize: initialize
  };
});

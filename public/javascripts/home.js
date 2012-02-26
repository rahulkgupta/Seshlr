// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'views/home/seshfeedview',
	'views/courses/searchdepts',
	'views/sidebar/sidebarview',
	'views/home/seshcreationview'
], function($, _, Backbone, sfView, SearchDepts, sidebarView, CreateSesh){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		Backbone.Model.prototype.idAttribute = "_id";

		var searchview = new SearchDepts;
		var createSesh = new CreateSesh;
		var sidebar = new sidebarView;
		var seshFeedView = new sfView;


		now.distributeSession = function (sesh) {
			//seshFeedView.addSeshView(sesh);
		}
  }

  return {
    initialize: initialize
  };
});

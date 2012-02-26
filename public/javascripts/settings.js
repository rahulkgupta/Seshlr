// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
	'views/courses/searchdepts',
], function($, _, Backbone, SearchDepts){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		Backbone.Model.prototype.idAttribute = "_id";

		var addCourses = new SearchDepts;

		now.distributeSession = function (sesh) {
			//seshFeedView.addSeshView(sesh);
		}
  }

  return {
    initialize: initialize
  };
});

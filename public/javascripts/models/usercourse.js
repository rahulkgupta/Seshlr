define([
  'underscore',
  'backbone',
], function( _, Backbone){
	var userCourse = Backbone.Model.extend({
		url:'addcourse'
	});
  return userCourse;
});

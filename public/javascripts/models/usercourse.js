define([
  'underscore',
  'backbone',
], function( _, Backbone){

	var UserCourse = Backbone.Model.extend({

        idAttribute: "_id",
        
		url:'addcourse'
	});

    return UserCourse;
});

define([
  'underscore',
  'backbone',
], function( _, Backbone){

	var UserCourse = Backbone.Model.extend({

        idAttribute: "_id",
        
		url:'/apis/course/'
	});

    return UserCourse;
});

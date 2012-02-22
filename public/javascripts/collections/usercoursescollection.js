define([
  'underscore',
  'backbone',
  'models/usercourse'
], function(_, Backbone, userCourse){
  var UserClassesCollection = Backbone.Collection.extend({
    
		model: userCourse,
		
		url: '/apis/user/classes'
		


  });
 
  return new UserClassesCollection;
});

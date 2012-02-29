define([
  'underscore',
  'backbone',
  'models/usersesh'
], function(_, Backbone, userSeshModel){
  var userSessionsCollection = Backbone.Collection.extend({
    
		model: userSeshModel,
		
		url: '/apis/user/sessions'
	

  });
 
  return userSessionsCollection;
});

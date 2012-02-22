define([
  'underscore',
  'backbone',
  'models/usersession'
], function(_, Backbone, SessionFeedModel){
  var UserSessionsCollection = Backbone.Collection.extend({
    
		model: UserSessionModel,
		
		url: '/apis/user/sessions'
		


  });
 
  return new userSessionsCollection;
});

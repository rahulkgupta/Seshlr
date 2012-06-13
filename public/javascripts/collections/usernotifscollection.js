define([
  'underscore',
  'backbone',
  'models/usernotif'
], function(_, Backbone, userNotifModel){
  var userNotifsCollection = Backbone.Collection.extend({
    
		model: userNotifModel,
		
		url: '/apis/notifications'
	

  });
 
  return userNotifsCollection;
});

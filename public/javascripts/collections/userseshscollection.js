define([
  'underscore',
  'backbone',
  'models/usersesh'
], function(_, Backbone, userSeshModel){

   var userSeshs;
   var userSessionsCollection = Backbone.Collection.extend({
    
		model: userSeshModel,
		
		url: '/apis/user/sessions'
   });
 
  var initialize = function() {
      if (userSeshs) {
         return userSeshs;

      } else {
         var usrSesh = new userSessionsCollection
         usrSesh.fetch()
         userSeshs = usrSesh
         return userSeshs
      }
   }
  return {
      initialize: initialize
  }
});

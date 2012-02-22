define([
  'underscore',
  'backbone',
  'models/userclasses'
], function(_, Backbone, UserClassesModel){
  var UserClassesCollection = Backbone.Collection.extend({
    
		model: UserClassesModel,
		
		url: '/apis/user/classes'
		


  });
 
  return new UserClassesCollection;
});

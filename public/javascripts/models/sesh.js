define([
  'underscore',
  'backbone',
], function( _, Backbone){
    
    var userSeshModel = Backbone.Model.extend({
        urlRoot: "/apis/sesh",
        
        idAttribute: "_id",
    });
  
    return userSeshModel;
});

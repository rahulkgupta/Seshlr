define([
  'underscore',
  'backbone',
], function( _, Backbone){
    
    var userSeshModel = Backbone.Model.extend({
        idAttribute: "_id",
    });
  
    return userSeshModel;
});

define([
  'underscore',
  'backbone',
], function( _, Backbone){

    var FBFriend = Backbone.Model.extend({
        idAttribute: "id",
        
    });

    return FBFriend;
});

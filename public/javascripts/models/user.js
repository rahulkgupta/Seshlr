define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

   var user;

   var userModel = Backbone.Model.extend({
      idAttribute: "_id",
      urlRoot:'/apis/user',
   });

   var fetch = function() {
      if (user) {
         return user;

      } else {
         var usr = new userModel
         usr.fetch()
         user = usr
         console.log(user)
         return user
      }
   }

   var initialize = function () {
      return new userModel;
   }
  return {
      fetch: fetch,
      initialize: initialize
  }   
});

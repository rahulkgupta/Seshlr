define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
	var userModel = Backbone.Model.extend({
		urlRoot:'/apis/user',
	
	});
  return userModel;
});

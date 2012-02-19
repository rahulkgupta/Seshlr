define([
  'jquery',
  'underscore',
  'backbone',
	'now'
], function($, _, Backbone){
	var userModel = Backbone.Model.extend({
		urlRoot:'/apis/user',
	
	});
  return new userModel;
});

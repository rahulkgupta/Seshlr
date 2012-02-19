define([
  'jquery',
  'underscore',
  'backbone'
	'now'
], function($, _, Backbone){
	var userModel = Backbone.model.extend({
		urlRoot:'/apis/user'
	});
  return userModel;
  return {};
});

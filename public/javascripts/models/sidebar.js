define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
	var sidebarModel = Backbone.Model.extend({
		urlRoot:'/apis/user/sidebar',
	
	});
  return new sidebarModel;
});

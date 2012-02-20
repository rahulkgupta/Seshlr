define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
	var userModel = Backbone.Model.extend({
		urlRoot:'/apis/user',
	
	});
	var i = 0;
	for (i; i < 1000000; i++)
	{
	}
  return new userModel;
});

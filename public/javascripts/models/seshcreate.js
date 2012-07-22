define([
  'underscore',
  'backbone',
], function( _, Backbone){
	var SessionCreateModel = Backbone.Model.extend({
		urlRoot: "/apis/createSesh"
	});
  return SessionCreateModel;
});

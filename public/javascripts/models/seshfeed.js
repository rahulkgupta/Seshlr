define([
  'underscore',
  'backbone',
], function( _, Backbone){
	var SessionFeedModel = Backbone.Model.extend({
		idAttribute: "_id",
	});
  return SessionFeedModel;
});

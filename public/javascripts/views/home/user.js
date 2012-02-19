define([
  'jquery',
  'underscore',
  'backbone'
	'models/user'
	'text!templates/user/user.html'
], function($, _, Backbone, userModel, userUserTemplate){
	var userView = Backbone.View.extend({
		el: $("#session-feed"),
		initialize: function () {
			this.model = userModel;
			this.model.set({id: userId})
			this.model.fetch();
		},
		render: function () {
			
		}

	});
  return new userView;
});

define([
  'jquery',
  'underscore',
  'backbone',
	'models/user',
	'text!templates/user/user.html'
], function($, _, Backbone, userModel, userTemplate){
	var userView = Backbone.View.extend({
		el: $("#session-feed"),
		initialize: function () {
			this.model = userModel;
			this.model.bind('change',this.render, this);
			this.model.fetch();
		},
		render: function () {

				var data = {
					user: this.model
				};
				var compiledTemplate = _.template( userTemplate, data );
				console.log(compiledTemplate);
				$(this.el).append(compiledTemplate)
		}

	});
  return userView;
});

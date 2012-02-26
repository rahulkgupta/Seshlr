define([
  'jquery',
  'underscore',
  'backbone',
	'text!templates/seshfeed.html'
], function($, _, Backbone, seshFeedTemplate){
	var SeshFeedView = Backbone.View.extend({
		el: $("#session-feed"),

		events: {
			'click #add-session' : 'addSession',

		},
		initialize: function (sesh, added) {
			this.model = sesh;
			this.added = added;
		},
		render: function () {
				var data = {
					_: _,
					sesh: this.model,
					added: this.added
				};
				var compiledTemplate = _.template( seshFeedTemplate, data );
				$(this.el).append(compiledTemplate)
		},

		addSession: function (event) {
			now.addSession(this.model.id);
		},
	});
  return SeshFeedView;
});

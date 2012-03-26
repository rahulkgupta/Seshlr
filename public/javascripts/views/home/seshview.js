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
			'click #remove-session' : 'removeSession',
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

		preRender: function () {	
				var data = {
					_: _,
					sesh: this.model,
					added: this.added
				};
				var compiledTemplate = _.template( seshFeedTemplate, data );
				return compiledTemplate;
		},

		addSession: function (event) {
			now.addSession(this.model.id, function (sesh) {

			});
		},

		removeSession: function (event) {
			now.removeSession(this.model.id)
		},
	});
  return SeshFeedView;
});

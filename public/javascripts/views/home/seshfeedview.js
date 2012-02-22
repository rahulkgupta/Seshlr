define([
  'jquery',
  'underscore',
  'backbone',
	'collections/seshfeedcollection',
	'text!templates/seshfeed.html'
], function($, _, Backbone, seshFeedCollection, seshFeedTemplate){
	var SeshFeedView = Backbone.View.extend({
		el: $("#session-feed"),
		initialize: function () {
			this.collection = seshFeedCollection;
			this.collection.bind('reset',this.render, this);
			this.collection.fetch();
		},
		render: function () {
				console.log(this.collection);
				var data = {
					_: _,
					seshs: this.collection.models
				};
				var compiledTemplate = _.template( seshFeedTemplate, data );
				console.log(compiledTemplate);
				$(this.el).append(compiledTemplate)
		},

		addSession: function (event) {
			now.addSession(this.model.id, function(sessiondata) { // Callback with data from the DB.
				//add the session to your current sessions
			});
		}

	});
  return SeshFeedView;
});

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
			this.collection = new seshFeedCollection;
			this.collection.bind('reset',this.render, this);
			//this.collection.fetch();
		},
		render: function () {
				var data = {
					_: _,
					seshs: this.collection.models
				};
				var compiledTemplate = _.template( seshFeedTemplate, data );
				$(this.el).append(compiledTemplate)
		},

		addSession: function (event) {
			now.addSession(this.model.id, function(sessiondata) { // Callback with data from the DB.
				//add the session to your current sessions
			});
		},

		addSeshView: function (sesh) {
			this.collection.add(sesh, {at: 0})
			this.remove();
			this.render();
		}

	});
  return SeshFeedView;
});

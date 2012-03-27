define([
  'jquery',
  'underscore',
  'backbone',
	'text!templates/seshfeed.html'
], function($, _, Backbone, seshFeedTemplate){
		var SeshFeedView = Backbone.View.extend({

		tagName:'tr',

		events: {
			'click #add-session' : 'addSession',
			'click #remove-session' : 'removeSession'
		},
		initialize: function (sesh, added) {
			this.model = sesh;
			this.added = added;
		},

		render: function () {	
				var date = new Date(this.model.get('time'))
				var data = {
					_: _,
					sesh: this.model,
					date: date,
					added: this.added
				};
				var compiledTemplate = _.template( seshFeedTemplate, data );
				
				this.el.innerHTML = compiledTemplate
				return this
		},


		addSession: function (event) {
			now.addSession(this.model.id, function (sesh) {

			});
		},

		removeSession: function (event) {
			console.log('removing')
			now.removeSession(this.model.id);
		}
	});
  return SeshFeedView;
});

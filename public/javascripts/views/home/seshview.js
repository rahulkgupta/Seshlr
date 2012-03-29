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
					time: this.getTime(date),
					added: this.added
				};
				var compiledTemplate = _.template( seshFeedTemplate, data );
				
				this.el.innerHTML = compiledTemplate
				return this
		},
		
		getTime: function(date) {
			var hr = date.getHours();
			var min = date.getMinutes();
			var minstr = min.toString();
			if (min < 10) {
				var zero = '0'
				minstr = zero.concat(minstr)
			}
			var hrtr
			if (hr == 0) {
				hr = 12;
				hrstr = hr + ":" + minstr + " AM"
			} else if (hr < 12) {
				hrstr = hr + ":" + minstr + " AM"
			} else if (hr == 12) {
				hrstr = hr + ":" + minstr + " PM"
			} else if (hr > 12) {
				hr = hr - 12
				hrstr = hr + ":" + minstr + " PM"
			}
			return hrstr
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

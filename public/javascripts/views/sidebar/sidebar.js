define([
  'jquery',
  'underscore',
  'backbone',
	'models/sidebar',
	'text!templates/sidebar/sidebar.html'
], function($, _, Backbone, sidebarModel, sidebarTemplate){
	var sidebarView = Backbone.View.extend({
		el: $(".sidebar-container"),
		initialize: function () {
			this.model = sidebarModel;
			this.model.bind('change',this.render, this);
			this.model.fetch();
		},
		render: function () {

				var data = {
					user: this.model
				};
				var compiledTemplate = _.template( sidebarTemplate, data );
				$(this.el).append(compiledTemplate)
		}

	});
  return sidebarView;
});

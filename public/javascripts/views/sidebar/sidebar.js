define([
  'jquery',
  'underscore',
  'backbone',
	'collections/userclassescollection',
	'text!templates/sidebar/sidebar.html'
], function($, _, Backbone, classCollection, sidebarTemplate){
	var sidebarView = Backbone.View.extend({
		el: $(".sidebar-container"),
		initialize: function () {
			this.collection = classCollection;
			this.collection.bind('reset',this.render, this);
			this.collection.fetch();
		},
		render: function () {

				var data = {
					_: _,
					classes: this.collection.models
				};
				var compiledTemplate = _.template( sidebarTemplate, data );
				$(this.el).append(compiledTemplate)
		}

	});
  return sidebarView;
});

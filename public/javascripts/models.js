
//credit to Jed Parsons
//https://github.com/jedp/redis-completer
//
var SearchView = Backbone.View.extend({
	el : '#application',

	events: {
    'keyup #search': 'search'
  },

	search: function(event) {
    // Search for what the user has typed
   	var text = $('#search-input').val();
		

    now.search(text, function(err, docs) {
			$(this.el).append('working');
			$(this.el).append(docs);

    });
  },


});
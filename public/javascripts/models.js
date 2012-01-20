
//credit to Jed Parsons
//https://github.com/jedp/redis-completer
//
var SearchView = Backbone.View.extend({
	el : '#application',

	events: {
    'keyup #search': 'search'
  },

	initialize: function() {
		this.text = "";
	},


	search: function(event) {
    // Search for what the user has typed
    this.text = $('#search-input').val();
		

    now.search(text, 10, function(err, results) {
      _.each(results, function(line) {
        var match = line.match(/(@\w+)?\s*(.*)/);
        var username = match[0] || '';
        var text = match[1] || '';
        var tweet = new Tweet(
          {username: tweetToHtml(username),
           text: tweetToHtml(text)});
        self.addTweet(tweet);
      });
    });
  },

	render: function() {
		$(this.el).append(this.text);
	}

});

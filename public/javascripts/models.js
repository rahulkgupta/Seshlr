
//credit to Jed Parsons
//https://github.com/jedp/redis-completer
//
var SearchView = Backbone.View.extend({
	el : '#course-selector',
	depts: '#depts',
	
	events: {
    'keyup #dept-search-input': 'search',
    'click .dept-select' : 'submit'
  },

	search: function(event) {
    // Search for what the user has typed
   	var text = $('#dept-search-input').val();
		
		var self = this;

    now.search(text, function(err, docs) {
    	$(self.depts).html('');
    	docs.forEach(function(dept) {
    		$(self.depts).append('<a href="javascript:void(0)" class="dept-select">' + dept + '</a><br />');
    		});
    });
  },
  
  submit: function(event) {
		var self = this;
  },


});

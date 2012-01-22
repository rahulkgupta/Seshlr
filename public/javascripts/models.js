
//credit to Jed Parsons
//https://github.com/jedp/redis-completer
//
var Department = Backbone.Model.extend({});
var DepartmentView = Backbone.View.extend({
  el: $('#depts'),
  
  events: {
  	'click .dept-select' : 'submit',
  },

  initialize: function(dept) {
    _.bindAll(this, 'render');
    this.render(dept);
  },

  render: function(dept) {
    $(this.el).append('<a href="javascript:void(0)" class="dept-select" data-id="' + dept + '" >' + dept + '</a><br />');
  },
  
  submit: function(event) {
  	var self = this;
  	var dept = $(event.currentTarget).data('id');
  	now.submit(dept);
  	event.stopPropogation();
  },
  
});

var SearchView = Backbone.View.extend({
	el : '#course-selector',
	depts: '#depts',
	
	events: {
    'keyup #dept-search-input': 'search',
  },

	search: function(event) {
    // Search for what the user has typed
   	var text = $('#dept-search-input').val();
		
		var self = this;

    now.search(text, function(err, docs) {
    	$(self.depts).html('');
    	docs.forEach(function(dept) {
    		var department = new DepartmentView(dept);
    		});
    });
  },

});

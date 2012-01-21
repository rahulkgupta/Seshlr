
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
    		var department = new Department({name: dept});
    		self.addDepartment(department);
    		});
    });
  },
  
  addDepartment: function(department) {
  	var self = this;
  	var view = new DepartmentView({model: department});
  	$(self.depts).append(view.render().el);
  },
  
  submit: function(event) {
		var self = this;
  },


});


//credit to Jed Parsons
//https://github.com/jedp/redis-completer
//
/* var Department = Backbone.Model.extend({});
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
  
}); */

var SearchView = Backbone.View.extend({
	el : '#course-selector',
	depts: '#depts',
	dept_search: '#dept-search',
	courses: '#courses',
	course_search: '#course-search',
	
	events: {
    'keyup #dept-search-input': 'search',
    'click .dept-select' : 'submitDept',
    'keyup #course-search-input' : 'submitDept',
  },
  
  initialize: function() {
  	var self = this;
  	$(self.course_search).hide();
  },

	search: function(event) {
    // Search for what the user has typed
   	var text = $('#dept-search-input').val();
		
		var self = this;

    now.search(text, function(err, docs) {
    	$(self.depts).html('');
    	docs.forEach(function(dept) {
    		// var department = new DepartmentView(dept);
    		$(self.depts).append('<a href="javascript:void(0)" class="dept-select" data-id="' + dept + '" >' + dept + '</a><br />');
    		});
    });
  },
  
  submitDept: function(event) {
    var self = this;
    if (event.type == 'click') {
  		var dept = $(event.currentTarget).data('id');
  		$('#dept-search-input').val(dept);
  	}
  	else {
  		var dept = $('#dept-search-input').val()
  	}
  	
  	var text = $('#course-search-input').val();
  	
  	$(self.course_search).show();
  	
  	now.submit(dept, text, function(err, docs) {
  		$(self.courses).html('');
  		docs.forEach(function(array) {
  			var course = array['num'];
  			$(self.courses).append('<a href="javascript:void(0)" class="course-select" data-id="' + $.trim(course) + '" >' + $.trim(course) + '</a><br />');
  		});
  	});
  },

});

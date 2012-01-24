
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
    'keyup #dept-search-input': 'searchDepts',
    'click .dept-select' : 'submitDept',
    'focus #course-search-input' : 'searchCourses',
    'keyup #course-search-input' : 'searchCourses',
    'click .course-select' : 'submitClass',
  },
  
  initialize: function() {
  	var self = this;
  	$(self.course_search).hide();
  },

	searchDepts: function(event) {
    // Search for what the user has typed
   	var text = $('#dept-search-input').val();
		var self = this;

    now.searchDept(text, function(err, docs) {
    	$(self.depts).html('');
    	docs.forEach(function(dept) {
    		// var department = new DepartmentView(dept);
    		$(self.depts).append('<a href="javascript:void(0)" class="dept-select" data-id="' + dept + '" >' + dept + '</a><br />');
    		});
    });
  },
  
  submitDept: function(event) {
    var self = this;
  	var dept = $(event.currentTarget).data('id');
  	$('#dept-search-input').val(dept);
  	$(self.course_search).show();
  	$('#course-search-input').focus();
  },
  	
  searchCourses: function(event) {
  	var self = this;  	
  	var text = $('#course-search-input').val();
  	var dept = $('#dept-search-input').val();
  	
  	now.searchCourse(dept, text, function(err, docs) {
  		$(self.courses).html('');
  		docs.forEach(function(array) {
  			var course = array['num'];
  			$(self.courses).append('<a href="javascript:void(0)" class="course-select" data-id="' + course + '" >' + course + '</a><br />');
  		});
  	});
  },
  
  submitClass: function(event) {
  	var self = this;
  	var course = $(event.currentTarget).data('id');
  	var dept = $('#dept-search-input').val()
  	
  	$('#course-search-input').val(course);
  	
  	now.submitClass(dept, course);
  },

});

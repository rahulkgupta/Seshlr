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
    //'click .course-select' : 'submitClass',
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
				var id = array['_id'];
  			$(self.courses).append('<a href="/add_class/'+ id + '" class="course-select" data-id="' + course + '" >' + course + '</a><br />');
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

var SessionCreationModel = Backbone.Model.extend ({
	url:function() {
		return '/create_session';
	}

});

var CourseModel = Backbone.Model.extend ({});

var CourseView = Backbone.View.extend ({
	
	el: "#classtest",
	
	initialize: function () {
		$(this.el).append(JSON.stringify(this.model))
	}

})
var CourseCollection = Backbone.Collection.extend ({

	model:CourseModel,
	
	initialize: function () {
			var self = this;
		_.each ($('.course'), function (course) {
				var courseModel = new CourseModel({id: course.id, name: $(course).text()});
				var courseView = new CourseView({model:courseModel});
				self.add(courseModel);
		});
		
	}	

});


var SessionCreationView = Backbone.View.extend ({

	el: "#session-creation",
	
	events: {
		'click #create-session' : 'showSessionCreation',
		'click #submit-session'	: 'submitSessionCreation'

	},

	showSessionCreation: function (event) {
		$('#select-course').show();
		$('#time').show();
		$('#title').show();
		$('#location').show();
		$('#description').show();
		$('#submit-session').show();
		
	},

	submitSessionCreation: function (event) {
		var day = $('#time-input').val();
		var dayformatted = day.slice(6) + '-' + day.slice(0,2) + '-' + day.slice(3,5);
		var hour = $('#hour-pick').val();
		var halfday = $('#halfday-pick').val();
		var datestring = new String(dayformatted + 'T' + hour + ':00Z');
		var course = $('#select-course-input').val();
		var title = $('#title-input').val();
		var location = $('#location-input').val();
		var description = $('#description-input').val();
		this.model.set({time: datestring, course: course, title: title, location: location, description: description});
		now.addSession(this.model);
	}
});




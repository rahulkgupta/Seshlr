var util = require('util')
  , mongoose = require('mongoose');

var cfg = require('konphyg')(__dirname + '/public/config');
var configdata = cfg('config');

mongoose.connect(configdata.db);
var Schema = mongoose.Schema


var Class = new Schema ({
    dept  : String
  , num   : String
  , name  : String
  , lec   : String
});

var sched = mongoose.model('Class',Class); 

function editCourse(course) {
	var newname = course.get('name')
	// while (newname.substring(0,1) == '')
  newname = newname.substring(1, newname.length);
	console.log(newname)
	course.name = newname
	course.save()
}

mongoose.model('Class').find({}, function(err, courses) {
	courses.forEach(editCourse)
})
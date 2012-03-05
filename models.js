var cfg = require('konphyg')(__dirname + '/public/config');
var configdata = cfg('config');
var mongoose = require('mongoose');
mongoose.connect(configdata.db);
var Schema = mongoose.Schema;

var Class = new Schema ({
    dept  : String
  , num   : String
  , name  : String
});


var StudyTime = new Schema ({
		time 	: Date
	,	loc 	: {
					x : Number
				,	y : Number
		}
	, course: { type: Schema.ObjectId, ref: 'Class' }
	, description : String
	, title	:	String
	, comments: [SessionComment]
	, users: [{ type: Number, ref: 'User' }]
	, created : Date
	
});

var User = new Schema ({
		_id: {type: Number, unique: true}	
	,	name: String
	,	link: String
	,	picture: String
	,	refreshToken: String
	, expiresIn: Number
	, classes: [{ type: Schema.ObjectId, ref: 'Class' }]
});

	

var SessionComment = new Schema ({
		time: Date
	, author: { type: Schema.ObjectId, ref: 'User' }
	, text: String
});


var user = mongoose.model('User', User);
var studyTime = mongoose.model('StudyTime', StudyTime);







var sched = mongoose.model('Class',Class); 

var seshcomment = mongoose.model('SessionComment', SessionComment)


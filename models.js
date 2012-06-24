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
var User = new Schema ({
	fbId: {type: Number, unique: true, index: true },
    email: String,
    password: String,
    name: String,
    first_name: String,
    link: String,
    picture: String,
    refreshToken: String,
    expiresIn: Number,
    classes: [{ type: Schema.ObjectId, ref: 'Class' }]
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
	, users: [{ type: Schema.ObjectId, ref: 'User' }]
	, created : Date
	
});



var FBFriend  = new Schema ({
		friend_id: Number
	,	user_id: Number  
	, name: String
});

var SessionComment = new Schema ({
		created: Date
	, author: { type: Schema.ObjectId, ref: 'User' }
	, text: String
});

var Notification = new Schema ({
    created: Date
  , source: { type: Schema.ObjectId, ref: 'User' }
  , text: String
  , ref: { type: Schema.ObjectId, ref: 'Session' }
  , users: [{ type: Number, ref: 'User' }]
});


var user = mongoose.model('User', User);
var fb_friend = mongoose.model('FBFriend', FBFriend);
var studyTime = mongoose.model('StudyTime', StudyTime);
var notification = mongoose.model('Notification', Notification);






var sched = mongoose.model('Class',Class); 
var seshcomment = mongoose.model('SessionComment', SessionComment)


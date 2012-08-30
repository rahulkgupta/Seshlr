var cfg = require('konphyg')(__dirname + '/public/config');
var configdata = cfg('config');
var mongoose = require('mongoose');
var db = mongoose.createConnection(configdata.db);
var ObjectId = mongoose.Schema.Types.ObjectId;

// Assigning models to the global namespace for now. This should make DB related stuff convenient.
// FIXME: Revisit this later - its against node convention and in the future we could split models into several files.
GLOBAL.Class = db.model('Class', mongoose.Schema ({
    dept  : String,
    num   : String,
    type  : String,
    subnum : Number,
    name  : String,
    ccn   : {type: Number, unique: true, index: true}
}));

GLOBAL.User = db.model('User', mongoose.Schema ({
    fbId: {type: Number, unique: true, index: true },
    email: String,
    password: String,
    name: String,
    first_name: String,
    link: String,
    picture: String,
    access_token: String,
    classes: [{ type: ObjectId, ref: 'Class' }],
    hasSignedUp: { type: Boolean, default: false },
    seshs : [{type: ObjectId, ref: 'StudyTime'}]
}));

GLOBAL.SessionComment = db.model('SessionComment', mongoose.Schema ({
    created: Date,
    author: { type: ObjectId, ref: 'User' },
    text: String
}));

GLOBAL.Sesh = db.model('Sesh', mongoose.Schema ({
    time: Date,
    loc: {
        x : Number,
        y : Number
    },
    course: { type: ObjectId, ref: 'Class' },
    description : String,
    title :   String,
    comments: [SessionComment],
    users: [{ type: ObjectId, ref: 'User' }],
    created : Date
}));

GLOBAL.Notification = db.model('Notification', mongoose.Schema ({
    created: Date,
    source: { type: ObjectId, ref: 'User' },
    text: String,
    ref: { type: ObjectId, ref: 'Session' },
    users: [{ type: Number, ref: 'User' }]
}));
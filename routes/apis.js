var mongoose = require('mongoose');

exports.user = function(req, res) {
    var userId = req.params.id;
    if (!userId) {
        var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
    }
    mongoose.model('User')
    .findById(userId)
   .populate('classes')
    .run(function (err, usr) {
        res.send(usr)
    });
}


exports.usersessions = function (req, res) {
    var userId = req.params.id;
    if (!userId) {
        var userId = req.user.id;
    }
    mongoose.model('StudyTime')
    .find({users: userId, time: {$gte: new Date()}})
    .populate('course')
    .run(function (err, studytimes) {
        res.send(studytimes)
    }); 
}

exports.allclasses = function (req, res) {
    mongoose.model('Class').find({}, function(err, courses) {
        res.send(courses);
    });
}

exports.alldepts = function (req, res) {
    mongoose.model('Class').distinct('dept', {}, function(err, depts) {
        res.send(depts);
    });
}

exports.courses = function (req, res) {
        var num = req.params.num;
        var dept = req.params.dept;
        mongoose.model('Class')
            .find({num:num, dept:dept})
            .run (function (err, courses) {
                res.send(courses)
            })
}

exports.seshfeed = function (req, res) {
    var userId = req.params.id;
    if (!userId) {
        var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
    }
    console.log(userId);
    mongoose.model('User')
        .findById(userId)
        .populate('classes')
        .run(function (err, usr) {
            mongoose.model('StudyTime')
                .find({course: {$in : usr.classes}, time: {$gte: new Date()}})
                .sort('created', -1)
                .populate('course',['name','_id'])
                .run(function (err, studyfeeds) {
                    res.send(studyfeeds);
                });
            });
        
}

exports.notifications = function(req, res) {
    // You shouldn't be able to call this API with another users ID.
    var userId = req.user.id
    mongoose.model('Notification')
        .find({users: userId})
        .run(function (err, notifs) {
            res.send(notifs);
        });
}

exports.createsesh = function (req, res) {
    var model = mongoose.model('StudyTime')
    var sesh = new model()
    var time = req.body.time;
    var title = req.body.title;
    var courseid = req.body.course;
    var description = req.body.description;
    sesh.time = time;
    sesh.title = title;
    sesh.description = description;
    sesh.created = req.body.created
    var classes = mongoose.model('Class');
    var userId = req.user.id //this needs to have validation
    sesh.users.push(userId);
    sesh.course = courseid;
    sesh.save(function (err) {
        if (err) console.log(err);
        else {
            sesh = sesh.toJSON()
            res.json(sesh,200)
        }
    });

}
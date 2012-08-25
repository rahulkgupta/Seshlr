var mongoose = require('mongoose');
var util = require('../util.js')

exports.all = function (req, res) {
    var userId = req.params.id;
    if (!userId) {
        var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
    }
    console.log(userId);
    mongoose.model('User')
        .findById(userId)
        .populate('classes')
        .exec(function (err, usr) {
            mongoose.model('StudyTime')
                .find({course: {$in : usr.classes}, time: {$gte: new Date()}})
                .sort('-created')
                .populate('course')
                .exec(function (err, studyfeeds) {
                    res.send(studyfeeds);
                });
            });
        
}

exports.save = function (req, res) {
    var newsesh = req.body
    mongoose.model('StudyTime')
    .findById(req.params.id)
    .exec(function (err, sesh) {
        if (err) { res.json({'error': err}, 200) }
        sesh.users = newsesh.users
        sesh.save(function(err) {
            if (err) console.log(err)
            else {
                console.log(sesh)
                res.json(sesh,200)
            }
        });
    });
}

exports.create = function (req, res) {
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
            mongoose.model('User')
            .findById(userId, function(err, usr) {
                usr.seshs.push(sesh.id)
                usr.save(function (err) {
                    if (err) console.log(err)
                    else {
                        sesh = sesh.toJSON()
                        res.json(sesh,200)
                    }
                })
            })
        }
    });

}


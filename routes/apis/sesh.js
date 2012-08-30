var mongoose = require('mongoose');
var util = require('../util.js')

exports.listSeshs = function (req, res) {
    User.findById(req.user.id)
    .populate('classes')
    .exec(function (err, usr) {
        Sesh.find({course: {$in : usr.classes}, time: {$gte: new Date()}})
        .sort('-created')
        .populate('course')
        .exec(function (err, studyfeeds) {
            res.send(studyfeeds);
        });
    });    
}

exports.updateSesh = function (req, res) {
    var newsesh = req.body
    Sesh.findById(req.params.id, function (err, sesh) {
        if (err) { res.json({'error': err}, 200) }
        util.updateObj(sesh, newsesh, {
            'relations': ['course', 'users'],
            'excludes': ['created'],
        });
        sesh.save(function(err) {
            if (err) console.log(err)
            else {
                console.log(sesh)
                res.json(sesh,200)
            }
        });
    });
}

exports.createSesh = function (req, res) {
    var sesh = new Sesh({
        time: req.body.time,
        title: req.body.title,
        description: req.body.description,
        course: req.body.course,
        users: [req.user.id],
    })
    sesh.save(function (err) {
        if (err) console.log(err);
        else {
            User.findById(userId, function(err, usr) {
                usr.seshs.push(sesh.id)
                usr.save(function (err) {
                    if (err) console.log(err)
                    else {
                        res.json(sesh,200)
                    }
                })
            });
        }
    });
}


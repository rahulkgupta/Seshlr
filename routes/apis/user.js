var mongoose = require('mongoose');
var util = require('../util.js')

exports.getUser = function(req, res) {
    var now = new Date()
    User.findById(req.user.id)
    .populate('classes')
    .populate('seshs')
    .exec(function (err, usr) {
        res.send(usr);
        for (var i = usr.seshs.length - 1; i >= 0; i--) {
            if (usr.seshs[i].time.getTime() < now.getTime()) {
                if (usr.seshs.length == 1) {
                    usr.seshs = []
                } else {
                    usr.seshs.splice(i,i) 
                }                
                usr.save()
            } 
        };
    });
}

exports.updateUser = function(req,res) {
    console.log(req.body)
    var userId = req.user.id;
    var user = req.body;
    User.findById(userId, function(err, usr) {
        util.updateObj(usr, user, {
            'relations': ['classes', 'seshs'],
            'excludes': ['fbId', 'password'],
        });
        usr.save()
        res.json({'error': null}, 200);
    });
}
var mongoose = require('mongoose');
var util = require('../util.js')

exports.fetch = function(req, res) {
    var userId = req.params.id;
    if (!userId) {
        var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
    }
    mongoose.model('User')
    .findById(userId)
    .populate('classes')
    .populate('seshs')
    .run(function (err, usr) {
        res.send(usr)
    });
}

exports.save = function(req,res) {
    var userId = req.user.id;
    var user = req.body;
    console.log(user)
    mongoose.model('User').findById(userId, function(err, usr) {
        util.updateObj(usr, user, ['classes', 'seshs']);
        usr.save(function(err) {
            console.log('ERROR: ' + err);
            console.log(usr);
        });
        res.json({'error': null}, 200);
    });
}
var mongoose = require('mongoose');
var util = require('../util.js')

exports.fetch = function (req, res) {
    // FIXME: Not crazy about this but I don't think it makes sense to have a seperate model for Depts only.
    if (req.query.depts_only) {
        mongoose.model('Class').distinct('dept', {}, function(err, depts) {
            depts_list = [] // This is a lame hack.
            depts.forEach(function(dept) {
                depts_list.push({'name': dept})
            });
            res.send(depts_list);
        });
    }
    else {
        var data = {}
        if (req.query.num) {
            data['num'] = req.query.num; // Have to use query I guess?
        }
        if (req.query.dept) {
            data['dept'] = req.query.dept;
        }
        mongoose.model('Class')
            .find(data)
            .exec (function (err, courses) {
                res.send(courses)
            })
    }
}
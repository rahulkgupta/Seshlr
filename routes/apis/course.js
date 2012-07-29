var mongoose = require('mongoose');
var util = require('../util.js')

exports.fetch = function (req, res) {
        var data = {}
        if (req.query.num) {
            data['num'] = req.query.num; // Have to use query I guess?
        }
        if (req.query.dept) {
            data['dept'] = req.query.dept;
        }
        console.log(data)
        mongoose.model('Class')
            .find(data)
            .run (function (err, courses) {
                res.send(courses)
            })
}
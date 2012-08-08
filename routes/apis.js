var mongoose = require('mongoose');
var ObjectID = mongoose.Types.ObjectId;


function isEmpty(obj) { 
    return Object.keys(obj).length === 0;
}
function updateObj(old, update, refs) {
    for (prop in update) {
        if (prop != '_id') {
            if (update[prop] instanceof Array) {
                if (!prop in refs) {
                    for (var i=0; i<=update[prop].length - 1; i++) {
                        if (old[prop[i]]) {
                            old[prop][i] = updateObj(old[prop][i], update[prop][i])
                        }
                        else {
                            old[prop][i] = update[prop][i]
                            console.log(old[prop][i])
                        }
                    }
                }
                else {
                    old[prop] = []
                    for (var i=0; i<=update[prop].length - 1; i++) {
                        obj_id = update[prop][i]._id;
                        old[prop].push(ObjectID(obj_id));
                    }
                }
            }
            else if (update[prop] instanceof Object) {
                console.log(update[prop])
                if (!prop in refs) {
                    old[prop] = updateObj(old[prop], update[prop])
                }
                else {
                    obj_id = update[prop]._id;
                    old[prop] = new ObjectID(obj_id)
                }
            }
            else {
                old[prop] = update[prop];
            }
        }
    }
}

/***************************
******** GET APIS **********
***************************/
exports.user = function(req, res) {
    var userId = req.params.id;
    var now = new Date()
    if (!userId) {
        var userId = req.user.id; // If the route is being called without an ID, use the logged in user own ID.
    }
    mongoose.model('User')
    .findById(userId)
    .populate('classes')
    .populate('seshs')
    .run(function (err, usr) {
        res.send(usr)
        console.log(now)
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

// exports.usersessions = function (req, res) {
//     var userId = req.params.id;
//     if (!userId) {
//         var userId = req.user.id;
//     }
//     mongoose.model('StudyTime')
//     .find({users: userId, time: {$gte: new Date()}})
//     .populate('course')
//     .run(function (err, studytimes) {
//         res.send(studytimes)
//     }); 
// }

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


/***************************
******** POST APIS **********
***************************/

exports.updateUser = function(req,res) {
    var userId = req.user.id;
    var user = req.body;
    mongoose.model('User').findById(userId, function(err, usr) {
        if (err) { res.json({'error': err}, 200) }
        updateObj(usr, user, ['classes', 'seshs']);
        usr.save(function(err) {
            console.log('ERROR: ' + err);
            console.log(usr);
        });
        res.json({'error': null}, 200);
    });
}

exports.addCourse = function (req, res) {
    if (req.loggedIn) {
        mongoose.model('Class')
        .findById(req.body.id)
        .run(function(err, course) {
            console.log(course)
            mongoose.model('User')
                .findById(req.user.id)
                .run(function (err, usr) {
                    if (err) { console.log(err); }
                    else {
                        if (usr.classes.indexOf(course._id) != -1) { // Honestly this can't be ideal.
                            console.log('The user is already enrolled in this class');
                        }
                        else {
                            usr.classes.push(course._id);
                            usr.save(function(err) {
                                if (err) { 
                                    console.log(err);
                                    res.send({'error': 'Could not add class. Try again...'});
                                }
                                else {
                                    console.log('Added class: ' + usr.classes)
                                    res.send({'error' : null});
                              } 
                            });
                        }
                    }
            });
        })
    }
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


exports.updatesesh = function (req, res) {
    var newsesh = req.body
    mongoose.model('StudyTime')
    .findById(req.params.id)
    .run(function (err, sesh) {
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

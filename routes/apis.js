<<<<<<< HEAD
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

exports.user = require('./apis/user')
exports.course = require('./apis/course')
exports.sesh = require('./apis/sesh')

exports.updateObj = function(old, update, refs) {
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
                    // NOTE: It's not possible to both add and remove items from a list at the same time.
                    // So we need to determine if we're adding or removing and then act accordingly.
                    temp = []
                    for (i=0; i<update[prop].length; i++) {
                        temp.push(update[prop][i]._id)
                    }
                    old[prop] = temp
                    /* if (update[prop].length > old[prop].length) {
                        // Annoying but we need to convert this to just a list of ids to match DB.
                        for (i=0; i<update[prop].length; i++) {
                            update[prop][i] = update[prop][i]._id
                        }
                        diff = update[prop].diff(old[prop])
                        console.log(diff)
                        for (var i=0; i<diff.length; i++) {
                            old[prop].push(diff[i])
                        }
                    }
                    else if (update[prop].length < old[prop].length) {
                        // Annoying but we need to convert this to just a list of ids to match DB.
                        for (i=0; i<update[prop].length; i++) {
                            update[prop][i] = update[prop][i]._id
                        }
                        diff = old[prop].diff(update[prop])
                        console.log(diff)
                        for (var i=0; i<diff.length; i++) {
                            idx = old[prop].indexOf(diff[i])
                            if (idx >= 0) {
                                old[prop].pop(idx)
                            }
                        }
                    }*/
                }
            }
            else if (update[prop] instanceof Object) {
                if (!prop in refs) {
                    old[prop] = updateObj(old[prop], update[prop])
                }
                else {
                    old[prop] = update[prop]._id;
                }
            }
            else {
                old[prop] = update[prop];
            }
        }
    }
}
exports.updateObj = function(old, update, options) {
    // options is a dictionary with signature {'relations': [], 'excludes': []}
    // excludes allows for specific validation within APIs
    // relations converts client embedded object representation into ID refs in the DB.
    refs = options['relations']
    excludes = options['excludes'] + ['_id']
    for (prop in update) {
        if (!prop in excludes) {
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
                    temp = []
                    for (i=0; i<update[prop].length; i++) {
                        temp.push(update[prop][i]._id)
                    }
                    old[prop] = temp
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
define([
    'underscore',
    'backbone',
    'models/sesh'
],  function(_, Backbone, Sesh){

    var userSeshs;

    var UserSessionsCollection = Backbone.Collection.extend({
        
        model: Sesh,

        fetchSeshs: function () {
            if (userSeshs.length == 0) {
                userSeshs.fetch()
            } else {
                userSeshs.trigger('reset')
            }
        }

    });


    var initialize = function () {
        if (userSeshs) {
            return userSeshs;
        } else {
            var usrSshs = new UserSessionsCollection
            userSeshs = usrSshs
            return userSeshs;
        }        
    }

    var test = function () {
        console.log(userSeshs)
    }

    return {
        initialize: initialize,
        test: test,
    }
});

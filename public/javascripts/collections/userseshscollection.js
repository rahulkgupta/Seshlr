define([
    'underscore',
    'backbone',
    'models/sesh'
],  function(_, Backbone, Sesh){

    var userSeshs;

    var UserSessionsCollection = Backbone.Collection.extend({
        
        model: Sesh,

        fetchSeshs: function () {
            if (this.length == 0) {
                this.fetch()
            } else {
                this.trigger('reset')
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

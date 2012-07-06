define([
    'underscore',
    'backbone',
    'models/usersesh'
],  function(_, Backbone, userSeshModel){

    var userSeshs;

    var UserSessionsCollection = Backbone.Collection.extend({
        
        model: userSeshModel,

        url: '/apis/user/sessions',

        fetchSeshs: function () {
            if (this.length == 0) {
                this.fetch()
            } else {
                console.log('triggering')
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

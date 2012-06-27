define([
    'underscore',
    'backbone',
    'models/usersesh'
],  function(_, Backbone, userSeshModel){

    var userSeshs;
    var UserSessionsCollection = Backbone.Collection.extend({
        
        model: userSeshModel,

        url: '/apis/user/sessions'

    });
   
    var fetch = function() {
        if (userSeshs) {
            return userSeshs;
        } else {
            var usrSesh = new UserSessionsCollection
            usrSesh.fetch()
            userSeshs = usrSesh
            return userSeshs
        }
    }

    var initialize = function () {
        return new UserSessionsCollection;
    }
    return {
        fetch: fetch,
        initialize: initialize
    }
});

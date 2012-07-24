define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){

    var user;

    var courses;

    var UserModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot:'/apis/user',

        fetchUser: function () {
            if (user.isNew()) {
                user.fetch()
            } else {
                user.trigger('change')
            }
        }

    });

    var initialize = function () {
        if (user) {
            return user;
        } else {
            var usr = new UserModel
            user = usr
            return user;
        }        
    }

    var test = function () {
        console.log(user)
    }

    return {
        initialize: initialize,
        test: test
    }   
});

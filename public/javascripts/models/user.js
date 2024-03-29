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
            if (this.isNew()) {
                this.fetch()
            } else {
                this.trigger('change')
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

    return {
        initialize: initialize,
    }   
});

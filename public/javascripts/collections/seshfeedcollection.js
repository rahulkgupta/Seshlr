define([
    'underscore',
    'backbone',
    'models/sesh'
], function(_, Backbone, Sesh){

    var seshFeed;

    var SeshFeedCollection = Backbone.Collection.extend({
    
        model: Sesh,
        
        url: '/apis/seshfeed',

        fetchFeed: function () {
            if (seshFeed.length == 0) {
                seshFeed.fetch()
            } else {
                seshFeed.trigger('reset')
            }
        }
    });

    var initialize = function () {
        if (seshFeed) {
            return seshFeed;
        } else {
            var sshFeed = new SeshFeedCollection
            seshFeed = sshFeed
            return seshFeed;
        }        
    }
    
 
    return {
        initialize: initialize
    }
});

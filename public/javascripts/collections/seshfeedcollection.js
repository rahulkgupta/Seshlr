define([
    'underscore',
    'backbone',
    'models/sesh'
], function(_, Backbone, Sesh){

    var seshFeed;

    var SeshFeedCollection = Backbone.Collection.extend({
    
        model: Sesh,
        
        url: '/apis/seshfeed',

        fetchFeed: function (force ) {
            if (this.length == 0) {
                this.fetch()
            } else {
                this.trigger('reset')
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

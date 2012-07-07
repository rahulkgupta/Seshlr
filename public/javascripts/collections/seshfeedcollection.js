define([
    'underscore',
    'backbone',
    'models/seshfeed'
], function(_, Backbone, SessionFeedModel){

    var seshFeed;

    var SeshFeedCollection = Backbone.Collection.extend({
    
        model: SessionFeedModel,
        
        url: '/apis/seshfeed',

        fetchFeed: function () {
            if (seshFeed.length == 0) {
                seshFeed.fetch({success: function () {console.log('test'); seshFeed.trigger('bar')}})
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

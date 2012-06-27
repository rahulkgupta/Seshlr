define([
    'underscore',
    'backbone',
    'models/seshfeed'
], function(_, Backbone, SessionFeedModel){

    var seshFeed;

    var SeshFeedCollection = Backbone.Collection.extend({
    
        model: SessionFeedModel,
        
        url: '/apis/seshfeed'
    });

    var fetch = function() {
        if (seshFeed) {
            return seshFeed;
        } else {
            var feed = new SeshFeedCollection
            feed.fetch()
            seshFeed = feed
            return seshFeed
        }
   }

    var initialize = function () {
        return new SeshFeedCollection;
    }
 
    return {
        fetch: fetch,
        initialize: initialize
    }
});

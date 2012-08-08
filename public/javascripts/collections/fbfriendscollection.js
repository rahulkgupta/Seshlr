define([
  'underscore',
  'backbone',
  'models/fbfriend'
], 
function(_, Backbone, FBFriend) {
    var CourseCollection = Backbone.Collection.extend({
    
        model: FBFriend,
        url: 'https://graph.facebook.com/me/friends/',

        parse: function(response) {
            return response.data
        }
    });
    return CourseCollection;
});

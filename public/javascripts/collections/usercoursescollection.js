define([
    'underscore',
    'backbone',
    'models/usercourse'
], function(_, Backbone, userCourse){
    var courses
  
    var UserClassesCollection = Backbone.Collection.extend({
    
        model: userCourse,
        
        url: '/apis/user/classes',
        
    });

    var initialize = function () {
        if (courses) {
            return courses;
        } else {
            var crss = new UserClassesCollection
            courses = crss
            return courses;
        }        
    }

    return {
        initialize: initialize
    }
 
});

define([
    'underscore',
    'backbone',
    'models/usercourse'
], function(_, Backbone, course){
    var CourseCollection = Backbone.Collection.extend({
    
        model: course,
        
        url: '/apis/course/',

        /*
        fetchCourses: function (num, dept, options) {
            this.url = '/apis/courses'
            this.url += "/" + num + '/' + dept
            this.fetch(options)
        }
        */

    });
 
    return CourseCollection;
});

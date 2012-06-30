define([
    'jquery',
    'underscore',
    'backbone',
    'text!/../templates/courseview.html'
], function($, _, Backbone, courseTemplate){
        
    var CourseView = Backbone.View.extend({

        events: {
            'click #add-course' : 'addCourse',
        },

        initialize: function (course) {
            this.model = course;
            this.model.bind('clear', this.clear, this)
        },

        render: function () {

            var data = {
                    _: _,
                    course: this.model
                };
                var compiledTemplate = _.template( courseTemplate, data );  
                
            $(this.el).html(compiledTemplate)
            return this
        },

        addCourse: function (event) {
            console.log(this.model)
            this.model.save();
        },

        clear: function (event) {
            console.log('clearing')
            this.el.html('');
        }
        
    });
  
    return CourseView;

});

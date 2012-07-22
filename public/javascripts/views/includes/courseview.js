define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'text!/../templates/courseview.html'
], function($, _, Backbone, User, courseTemplate){
        
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
            this.user = User.initialize()
            this.user.fetch()
            this.user.get('classes').push(this.model)
            this.user.save()
        },

        clear: function (event) {
            console.log('clearing')
            this.el.html('');
        }
        
    });
  
    return CourseView;

});

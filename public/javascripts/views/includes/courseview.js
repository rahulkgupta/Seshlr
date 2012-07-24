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
            this.user = User.initialize()
            this.user.fetchUser()
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
            cls = this.user.get('classes')
            cls.push(this.model)
            this.user.set({classes: cls})
            this.user.save()
        },

        clear: function (event) {
            console.log('clearing')
            this.el.html('');
        }
        
    });
  
    return CourseView;

});

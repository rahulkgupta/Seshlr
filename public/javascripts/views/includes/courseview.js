define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'collections/usercoursescollection',
    'text!/../templates/courseview.html'
], function($, _, Backbone, User, Courses, courseTemplate){
        
    var CourseView = Backbone.View.extend({

        events: {
            'click #add-course' : 'addCourse',
        },

        initialize: function () {
            this.user = User.initialize()
            
            this.courses = Courses.initialize()
            this.courses.reset(this.user.get('classes'), {silent: true})

            this.model.bind('added', this.renderAdded, this)
            this.render()
        },

        render: function () {

            var data = {
                    _: _,
                    course: this.model,
                    added: false
                };
                var compiledTemplate = _.template( courseTemplate, data );  
            this.el.innerHTML = compiledTemplate
            return this
        },

        renderAdded: function () {

            var data = {
                    _: _,
                    course: this.model,
                    added: true
                };
                var compiledTemplate = _.template( courseTemplate, data );  
            this.el.innerHTML = ""
            return this
        },

        addCourse: function (event) {
            console.log(this.courses)
            this.courses.add(this.model, {silent: true})
            console.log(this.courses)
            this.user.set('classes', this.courses.toJSON(), {silent: true})
            var self = this
            this.user.save(null, {
                success: function (model, resp) {
                    self.user.trigger('change')
                    self.model.trigger('added')
                }
            })  
        },

        clear: function (event) {
            this.$el.html('');
        }
        
    });
  
    return CourseView;

});

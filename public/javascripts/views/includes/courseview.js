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
            
            this.courses = new Courses
            var self = this
            this.user.on("change", function () {
                self.courses.reset(self.user.get('classes'))
            })
            this.user.fetchUser()
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
            this.el.innerHTML = compiledTemplate
            return this
        },

        addCourse: function (event) {
            this.courses.add(this.model, {silent: true})
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

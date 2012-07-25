define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'collections/usercoursescollection',
    'text!/../templates/removecourse.html'
], function($, _, Backbone, User, Courses, courseTemplate){
        
    var CourseView = Backbone.View.extend({

        events: {
            'click #remove-course' : 'removeCourse',
        },

        initialize: function () {
            this.user = User.initialize()
            
            this.courses = new Courses
            var self = this
            this.user.on("change", function () {
                self.courses.reset(self.user.get('classes'), {silent: true})
            })
            this.model.on('remove', this.remove, this)
            this.user.fetchUser()
            this.render()
        },

        render: function () {

            var data = {
                    _: _,
                    course: this.model,
                };
                var compiledTemplate = _.template( courseTemplate, data );  
            this.el.innerHTML = compiledTemplate
            return this
        },


        removeCourse: function (event) {
            this.courses.remove(this.model, {silent: true})
            this.user.set('classes', this.courses.toJSON(), {silent: true})
            var self = this
            this.user.save(null, {
            success: function (model, resp) {
                self.user.trigger('change')
                self.model.trigger('remove')
            }
            })
        },

        clear: function (event) {
            this.$el.html('');
        },

        remove: function () {
            this.el.innerHTML = ""
            this.remove()
        }
        
    });
  
    return CourseView;

});

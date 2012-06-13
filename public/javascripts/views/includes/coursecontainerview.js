define([
  'jquery',
  'underscore',
  'backbone',
  'views/includes/courseview'
], function($, _, Backbone, CourseView){
      var CourseContainerView = Backbone.View.extend({

      el: $('#course-container'),
      

      events: {
      },

      initialize: function (courses) {
         this.collection = courses;
         this.collection.bind('reset', this.render, this);
      },

      render: function () {
         $(this.el).html('')
         console.log(this.collection)
         this.collection.each(this.showCourse, this)
         return this;
      },
      
      showCourse: function (course) {
         console.log(course.get('name'))
         var courseView = new CourseView (course)
         $(this.el).append(courseView.render().el);
      },
   });
  return CourseContainerView;
});


define([
  'jquery',
  'underscore',
  'backbone',
  'collections/usercoursescollection',
  'views/includes/addclass',
  'views/includes/removeclass'
], function($, _, Backbone, userCrses, searchCourses, removeCourses){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Backbone.Model.prototype.idAttribute = "_id";

    var courses = new userCrses;
    courses.fetch({success: function () {
      var addCourses = new searchCourses;
      var deleteCourses = new removeCourses(courses);
    }});

  }

  return {
    initialize: initialize
  };
});
define([
    'jquery',             
    'underscore',
    'backbone',
    'bs',
    'handlebars',
    'views/includes/addclass',
    'views/sidebar/sidebarview',
    'collections/coursescollection',
    'models/user',
    'text!/templates/signup.html',
    'text!/templates/base.html',
],  
function($, _, Backbone, BS, Handlebars, 
         AddClass, SidebarView, Courses, 
         User, SettingsTemplate, BaseTemplate)
{
    var SignupView = Backbone.View.extend({

        events: {
            'click #courses-submit': 'signup',
        },

        initialize: function () {
            //this.dept = new Dept
            //this.dept.bind("change",this.render, this)
            //this.dept.fetch()
            this.courses = new Courses
            this.courses.bind("reset", this.render, this)
            this.courses.fetch({
                data: {depts_only: true}
            })
            this.user = User.initialize()
            this.user.fetch()
          },

        render: function () {
            depts = []
            this.courses.forEach(function(course) {
                depts.push(course.get('name'))
            });
            var data = {
                depts: depts,
                _: _,
                $: $,
            };
            console.log(depts)
            var compiledTemplate = Handlebars.compile(SettingsTemplate);
            $(this.el).html(compiledTemplate)
            $('#dept-search-input').typeahead().data('typeahead').source = depts;
            var addClass = new AddClass ({el: this.$('#course-selector')})
        },


        signup: function() {
            self = this;
            console.log(this.user)
            this.user.set({hasSignedUp : true})
            this.user.save(null, {
                success: function(model, response) {
                    var compiledTemplate = Handlebars.compile(BaseTemplate);
                    $(self.el).html(compiledTemplate);
                    var sidebar = new SidebarView({el :  $('.sidebar-container')})
                    Backbone.history.navigate('home', true);
                }
            });
        },

    });
      
    return SignupView;
});

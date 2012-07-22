define([
    'jquery',             
    'underscore',
    'backbone',
    'bs',
    'handlebars',
    'views/includes/addclass',
    'views/includes/removeclass',
    'views/sidebar/sidebarview',
    'models/dept',
    'models/user',
    'text!/templates/signup.html',
    'text!/templates/base.html',
],  
function($, _, Backbone, BS, Handlebars, 
         AddClass, RemoveClass, SidebarView, Dept, 
         User, SettingsTemplate, BaseTemplate)
{
    var SignupView = Backbone.View.extend({

        events: {
            'click #courses-submit': 'signup',
        },

        initialize: function () {
            console.log('test')
            this.dept = new Dept
            this.dept.bind("change",this.render, this)
            this.dept.fetch()
            this.user = User.initialize()
            this.user.fetch()
          },

        render: function () {

            console.log(this.dept.get('depts'))
            var data = {
                depts: this.dept.get('depts'),
                _: _,
                $: $,
            };

            var depts = this.dept.get('depts')

            var compiledTemplate = Handlebars.compile(SettingsTemplate);
            $(this.el).html(compiledTemplate)
            console.log($(this.el))
            $('#dept-search-input').typeahead().data('typeahead').source = depts

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

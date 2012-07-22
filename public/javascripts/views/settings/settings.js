define([
    'jquery',             
    'underscore',
    'backbone',
    'bs',
    'handlebars',
    'views/includes/addclass',
    'views/includes/removeclass',
    'models/dept',
    'text!/templates/settings.html'
],  
function($, _, Backbone, BS, Handlebars, 
         AddClass, RemoveClass, Dept,
         SettingsTemplate)
{
    var SettingsView = Backbone.View.extend({

        initialize: function () {
            this.dept = new Dept
            this.dept.bind("change",this.render, this)
            this.dept.fetch()
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
            // var html = compiledTemplate(data)
            $(this.el).html(compiledTemplate) 
            $('#dept-search-input').typeahead().data('typeahead').source = depts

            var addClass = new AddClass ({el: this.$('#course-selector')})
        },


    });
      
    return SettingsView;
});

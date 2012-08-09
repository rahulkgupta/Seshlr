define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar/seshview',
    'text!/templates/sidebar/course.html'
], function($, _, Backbone, 
    seshView,
    Template){

    var courseView = Backbone.View.extend({

        events: {
        },

        render: function () {
            var data = {
                _: _,
                $: $,
                course: this.model,
            };

            var compiledTemplate = _.template( Template, data );
            $(this.el).html(compiledTemplate);
            _.each(this.collection, this.renderSesh, this)
        },

        renderSesh: function (model) {
            var sesh = new seshView({model: model,
                                            collection: collection});
            sesh.render();
            $(this.el).append(sesh.el);
        },
    });;
    
    return courseView;
});

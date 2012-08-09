define([
    'jquery',
    'underscore',
    'backbone',
    'bs',
    'text!/templates/sidebar/sesh.html'
], function($, _, Backbone, BS,
    Template){

    var seshView = Backbone.View.extend({

        events: {
        },

        render: function () {
            var data = {
                _: _,
                $: $,
                sesh: this.model,
            };

            var compiledTemplate = _.template( Template, data );
            var date = new Date(this.model.get('time'))
            var timeString
            var hrs = date.getHours()
            var minString
            var min = date.getMinutes()
            if (min < 10) {
                minString = "0" + min
            } else {
                minString = min
            }
            if (hrs == 0) {
                timeString = "12:"+minString+" AM"
            } else if (hrs > 12)  {
                timeString = hrs-12 + ":" + minString + " PM"
            } else {
                timeString = hrs + ":" + minString + " PM"
            }
            var dateString = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear()
            $(this.el).popover({
                title: timeString + " " + dateString,
                content: "Description: " + this.model.get('description')
            })
            $(this.el).html(compiledTemplate);
        },
    });;
    
    return seshView;
});

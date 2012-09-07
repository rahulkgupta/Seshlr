define([
  'jquery',
  'underscore',
  'backbone',
  'kalendae',
  'collections/seshfeedcollection',
  'text!/../templates/calendar.html',
], function($, _, Backbone, Kalendae, Seshs, calendarTemplate){
        var calendarView = Backbone.View.extend({

        initialize: function() {
            this.seshs = Seshs.initialize()
            this.render()
        },
        
        render: function () {
            // console.log(new Kalendae(this.el))
            var data = {
                _: _,
                days: this.days,
            };

            var compiledTemplate = _.template( calendarTemplate, data );
            $(this.el).html(compiledTemplate) 
            this.cal = new Kalendae(this.el, {
                months:1,
                mode:'single',
                direction: 'today-future',
                useYearNav: false   
            });
            var self = this
            this.cal.subscribe('change', function () {
                self.seshs.fetch({data: {date: this.getSelected()}})
            })

            return this
        },

    });
  return calendarView;
});
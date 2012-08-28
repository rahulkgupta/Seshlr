define([
  'jquery',
  'underscore',
  'backbone',
  'kalendae',
  'text!/../templates/calendar.html',
], function($, _, Backbone, Kalendae, calendarTemplate){
    console.log(Kalendae)
    var calendarView = Backbone.View.extend({

        // events: {
        //     'click .calendar-prev': 'scrollPrev',
        //     'click .calendar-next': 'scrollNext',
        //     'click #calendar li': 'addBorder',
        // },
        
        initialize: function() {
            console.log(this.el)
            // Just some quickly written functions we need. This shit is all pretty hacky.
            // modular_day = function(day, diff) {
            //     day_index = day + diff
            //     new_index = day_index % 7
            //     if (new_index < 0) {
            //         new_index += 7
            //     }
            //     return new_index
            // }   
            // // Defining my CalDate class.
            // function CalDate(month, date, day) {
            //     this.month = month;
            //     this.date = date;
            //     this.day = day;
            //     this.current = false;

            //     CalDate.prototype.equals = function(other) {
            //         if (this.month == other.month && this.date == other.date && this.day == other.day) {
            //             return true
            //         }
            //         else {
            //             return false
            //         }
            //     }
            //     CalDate.prototype.convertNames = function() {
            //         this.month = monthNames[this.month]
            //         this.day = dayNames[this.day]
            //     }
            //     CalDate.prototype.get = function(attr) {
            //         return this.attr;
            //     }
            // }

            // var current = new Date();  
            // var month = current.getMonth();  
            // var date = current.getDate();
            // var day = current.getDay();
            // var year = current.getFullYear();

            // // Leap year handling
            // if (month == 1) {  
            //     if ( (year%100!=0) && (year%4==0) || (year%400==0)){  
            //         totalFeb = 29;  
            //     }
            // }
            // else {  
            //     totalFeb = 28;  
            // }

            // // Constants
            // var monthNames = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov", "Dec"];
            // var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            // var totalDays = ["31", ""+totalFeb+"","31","30","31","30","31","31","30","31","30","31"];

            // var today = new CalDate(month, date, day)
            // var date_list = []

            // // We want to support (for now) browsing up to two weeks in either direction from the current date. To cover all cases lets find up to 20 days before and after today.
            // var start_day = modular_day(day, -20)

            // // I should come back and replace this with a method in CalDate that lets you find a date given a difference.
            // if (date - 20 > 0) {
            //     var start = new CalDate(month, date - 20, start_day)
            // }
            // else {
            //     diff = 20 - date
            //     var start = new CalDate(month - 1, totalDays[today.month - 1] - diff, start_day)
            // }

            // // This is pretty filthy code but I think it works.
            // n=0;
            // iter_date = start.date;
            // iter_month = start.month;
            // past = true;
            // for (i=0; i<=88; i++) {
            //     if (iter_date <= totalDays[iter_month]) {
            //         temp_date = new CalDate(iter_month, iter_date, modular_day(start_day, i))
            //         if (temp_date.equals(today)) {
            //             cursor = i;
            //             past = false;
            //             temp_date.current = true;
            //         }
            //         temp_date.past = past;
            //         temp_date.convertNames()
            //         date_list.push(temp_date)
            //     }
            //     else {
            //         iter_month += 1
            //         n = 0
            //         iter_date = 0;
            //         i -= 1;
            //     }
            //     n++
            //     iter_date = iter_date + 1
            // }
            
            // cursor = cursor - today.day;
            // this.days = date_list;
            // this.month = today.month;
            // this.day = today.day;
            // this.monthNames = monthNames;
            // this.totalDays = totalDays;
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
                direction: 'future',
                useYearNav: false   
            });

            this.cal.subscribe('change', function () {
               console.log(this.getSelected());
            })

            return this
            // this.cal_loc = -100 * cursor;
            // $('#calendar ul').css('margin-left', this.cal_loc - 1)
            // $('.calendar-month').html(this.monthNames[this.month])
        },

        // scrollPrev: function(e) {
        //     this.cal_loc += 700;
        //     $('#calendar ul').animate({
        //         marginLeft: this.cal_loc - 1,
        //     });
        //     this.day -= 7;
        //     if (this.day <= 0) {
        //         this.month -= 1;
        //         this.day = parseInt(this.day) + parseInt(this.totalDays[this.month]);
        //     }
        //     $('.calendar-month').html(this.monthNames[this.month])
        //     e.preventDefault();
        // },

        // scrollNext: function(e) {
        //     this.cal_loc -= 700;
        //     $('#calendar ul').animate({
        //         marginLeft: this.cal_loc - 1,
        //     });
        //     this.day += 7;
        //     if (this.day > this.totalDays[this.month]) {
        //         this.day = this.day - this.totalDays[this.month];
        //         this.month += 1;
        //     }
        //     $('.calendar-month').html(this.monthNames[this.month])
        //     e.preventDefault();
        // },

        // addBorder: function(e) {
        //         $('#calendar li').removeClass('selected')
        //     $(e.currentTarget).toggleClass('selected');
        //     console.log(e.currentTarget.getAttribute('data-day'))

        // },

    });
  return calendarView;
});
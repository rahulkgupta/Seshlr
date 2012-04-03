define([
  'jquery',
  'underscore',
  'backbone',
  'text!/../templates/calendar.html',
], function($, _, Backbone, calendarTemplate){
	var searchView = Backbone.View.extend({
		el: '#calendar-container',

		events: {
			'click .calendar-prev': 'scrollPrev',
			'click .calendar-next': 'scrollNext',
		},
		
		initialize: function(courses) {
			// Just some quickly written functions we need. This shit is all pretty hacky.
			modular_day = function(day, diff) {
				day_index = day + diff
				new_index = day_index % 7
				if (new_index < 0) {
					new_index += 7
				}
				return new_index
			}	
			// Defining my CalDate class.
			function CalDate(month, date, day) {
				this.month = month;
				this.date = date;
				this.day = day;
				this.current = false;

				CalDate.prototype.equals = function(other) {
					if (this.month == other.month && this.date == other.date && this.day == other.day) {
						return true
					}
					else {
						return false
					}
				}
				CalDate.prototype.convertNames = function() {
					this.month = monthNames[this.month]
					this.day = dayNames[this.day]
				}
				CalDate.prototype.get = function(attr) {
					return this.attr;
				}
			}

			var current = new Date();  
			var month = current.getMonth();  
			var date = current.getDate();
			var day = current.getDay();
			var year = current.getFullYear();

			// Leap year handling
			if (month == 1) {  
				if ( (year%100!=0) && (year%4==0) || (year%400==0)){  
					totalFeb = 29;  
				}
			}
			else {  
				totalFeb = 28;  
			}

			// Constants
			var monthNames = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov", "Dec"];
			var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			var totalDays = ["31", ""+totalFeb+"","31","30","31","30","31","31","30","31","30","31"];

			var today = new CalDate(month, date, day)
			var date_list = []

			// We want to support (for now) browsing up to two weeks in either direction from the current date. To cover all cases lets find up to 20 days before and after today.
			var start_day = modular_day(day, -20)

			// I should come back and replace this with a method in CalDate that lets you find a date given a difference.
			if (date - 20 > 0) {
				var start = new CalDate(month, date - 20, start_day)
			}
			else {
				diff = 20 - date
				var start = new CalDate(month - 1, totalDays[today.month - 1] - diff, start_day)
			}

			// This is pretty filthy code but I think it works.
			n=0;
			iter_date = start.date;
			iter_month = start.month;
			console.log(iter_date)
			for (i=0; i<=88; i++) {
				if (iter_date <= totalDays[iter_month]) {
					temp_date = new CalDate(iter_month, iter_date, modular_day(start_day, i))
					if (temp_date.equals(today)) {
						cursor = i;
						temp_date.current = true;
					}
					temp_date.convertNames()
					date_list.push(temp_date)
				}
				else {
					iter_month += 1
					n = 0
					iter_date = 0;
					i -= 1;
				}
				n++
				iter_date = iter_date + 1
			}
			
			cursor = cursor - today.day;
			this.days = date_list;
			this.render();
		},
		
		render: function () {
			var data = {
				_: _,
				days: this.days,
			};
			console.log(this.days)
			var compiledTemplate = _.template( calendarTemplate, data );
			$('#calendar').append(compiledTemplate);

			this.cal_loc = -100 * cursor;
			console.log(this.cal_loc)
			$('#calendar ul').css('margin-left', this.cal_loc - 1)
		},

		scrollPrev: function(e) {
			this.cal_loc += 700;
			$('#calendar ul').animate({
				marginLeft: this.cal_loc - 1,
			});
			e.preventDefault();
		},

		scrollNext: function(e) {
			this.cal_loc -= 700;
			$('#calendar ul').animate({
				marginLeft: this.cal_loc - 1,
			});
			e.preventDefault();
		},

		test: function() {
			alert('test');
		}

	});
  return searchView;
});
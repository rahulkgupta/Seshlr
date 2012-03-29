define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
	var searchView = Backbone.View.extend({
		el : '#filter-calendar',
		
		events: {
		},
		
		initialize: function(courses) {
			// Just some quickly written functions we need. This shit is all pretty hacky.
			is_equal = function(x1, x2) {
				// This is so bad its not funny.
				if (x1[0] == x2[0] && x1[1] == x2[1]) {
					return true
				} else { return false } 
			}
			modular_day = function(day, diff) {
				day_index = day + diff
				new_index = day_index % 7
				if (new_index < 0) {
					new_index += 7
				}
				return new_index
			}

			var current = new Date();  
			var month = current.getMonth();  
			var date = current.getDate();
			var day = current.getDay();
			var year = current.getFullYear();

			console.log(day)
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

			var today = [monthNames[month], date, day]
			var date_array = []

			// We want to support (for now) browsing up to two weeks in either direction from the current date. To cover all cases lets find up to 20 days before and after today.
			var start_day = modular_day(day, -20)
			if (date - 20 > 0) {
				var start_date = [month, date - 20, start_day]
				var month_index = month
			}
			else {
				var month_index = month - 1
				diff = 20 - date
				var start_date = [month_index, totalDays[month_index] - diff, start_day]
			}

			// This is pretty filthy code but I think it works.
			n=0;
			month_val = 0;
			iter_date = start_date[1];
			for (i=0; i<=41; i++) {
				iter_month = month_index + month_val
				if (iter_date <= totalDays[iter_month]) {
					temp_date = [monthNames[iter_month], iter_date, dayNames[modular_day(start_day, i)]]
					if (is_equal(temp_date, today)) {
						temp_date.push(true);
					}
					date_array.push(temp_date)
				}
				else {
					month_val += 1
					n = 0
					iter_date = 0;
					i -= 1;
				}
				n++
				iter_date = iter_date + 1
			}

			console.log(date_array)

		},
		
		render: function () {
			
		},

	});
  return searchView;
});
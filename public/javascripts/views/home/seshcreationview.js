define([
  'jquery',
	'jui',
  'underscore',
  'backbone',
	'bsmodal',
	'models/seshcreate',
	'collections/usercoursescollection',
	'text!templates/seshcreate.html'
], function($, Jui, _, Backbone, bs, seshCreateModel, userCrss, seshcreationTemplate){
	var SeshCreationView = Backbone.View.extend ({
		
		el: "#session-creation",
	
		events: {
			'click #create-sesh' : 'showSeshCreation',
			'click #submit-sesh'	: 'submitSeshCreation',
			'click .get-fb' : 'fetchFriends',
			'keyup #fbfriends-input' : 'addFriend',
			'click .friendtag' : 'removeFriendTag',
			'submit #create-sesh-form' : 'submitSeshCreation',
			'click #pm-input' : 'togglePM',
			'click #am-input' : 'toggleAM',
			'focusin #time-input' : "clearTime",
			'focusout #time-input' : 'resetTime',
		},

		initialize: function(courses, userSeshs, user){
			this.model = new seshCreateModel;
			this.user = user;
			this.courses = courses;
			this.userSeshs = userSeshs;
			this.render();
			$('#date-input').datepicker()
			
		},

		fetchFriends: function(event) {
			event.preventDefault();
			// Bootstrap button stuff broken, this is good for now.
			$('.get-fb').addClass('disabled');
			$('.get-fb').html('One moment please...');
			now.getFBFriends(function(data) {
				typeahead_list = []
				data.forEach(function(friend) {
					typeahead_list.push([friend.id, friend.name]);
				});
				fb_input = $('#fbfriends-input').typeahead();
				fb_input.data('typeahead').source = typeahead_list;
				fb_input.data('typeahead').ishidden = true;
				$('.get-fb').hide();
				$('.fb-group').removeClass('hidden');
				$('#fbfriends-input').focus();
				$('#friendtag-container').data('value-hidden', []);
			});
		},

		removeFriendTag: function(event) {
			var id = $(event.currentTarget).attr("data-value-hidden")
			var lst = $('#friendtag-container').data('value-hidden')
			$('#friendtag-container').data('value-hidden').splice(lst.indexOf(id), 1);
			console.log(lst)
			$(event.currentTarget).remove();
		},

		addFriend: function(event) {
			if (event.keyCode == 13) {
				var newid = $('#fbfriends-input').attr('data-value-hidden')
				var close = '<a href="#" class="friendtag-close"><i class="icon-remove icon-white"></i></a>'
				var newtag = $('#friendtag-container').append('<button class="btn btn-primary friendtag" data-value-hidden="' + newid + '">' + $('#fbfriends-input').val() + close + '</button>');
				$('#friendtag-container').data('value-hidden').push(newid);
				console.log(newtag.data('value-hidden'));
				$('#fbfriends-input').val('');
			}
		},

		showSeshCreation: function (event) {
			$('#sesh-form').modal()
			$('#ui-datepicker-div').css('display','none');
			var date = new Date();
			if ($('#time-input').val() == "") {
				$('#date-input').datepicker('setDate', date)
				this.setTimeInput(date)
			}
			
		},
		
		setTimeInput: function(date) {
			var hr = date.getHours() + 1;
			if (hr % 24 == 0) {
				hr = 12;
				$('#am-input').attr('class','btn first-form active')
			} else if (hr < 12) {
				$('#am-input').attr('class','btn first-form active')
			} else if (hr == 12) {
				$('#pm-input').attr('class','btn active')
			} else if (hr > 12) {
				hr = hr - 12
				$('#pm-input').attr('class','btn active')
			}
			var hrstr = hr + ":00"
			$('#time-input').val(hrstr)
		},

		render: function () {
			var data = {
				_: _,
				courses: this.courses.models
			};
			var compiledTemplate = _.template( seshcreationTemplate, data );
			$("#session-creation").append(compiledTemplate);

		},

		clearTime: function(event) {
			$('#time-input').val("")
		},

		resetTime: function(event) {
			if ($('#time-input').val() == "") {
				var date = new Date();
				this.setTimeInput(date)
			}
		},

		togglePM: function (event) {
			$('#am-input').removeClass('active')
			$('#am-input').attr('class','btn first-form')
			$('#pm-input').attr('class','btn active')
		},

		toggleAM: function (event) {
			$('#pm-input').removeClass('active')
			$('#pm-input').attr('class','btn')
			$('#am-input').attr('class','btn first-form active')
		},

		submitSeshCreation: function (event) {
			var friends = $('#friendtag-container').data('value-hidden')
			var day = $('#date-input').datepicker('getDate');
			var today = new Date();
			console.log(today)
			var daystring = $('#date-input').val();
			var time = $('#time-input').val().split(':');
			if (!this.hrCheck(time)) {
				$("#date-form").attr("class", "control-group error")
				$('#date-error').text('Please provide a proper time.')
				return
			}
			var course = $('#select-course-input').val();
			var title = $('#title-input').val();
			var description = $('#description-input').val();
			this.setTime(day,time)
			if (title && day && day > today) {
				
				$('#sesh-form').modal("hide")
				var self = this;
				this.model.set({time: day, created: today, course: course, title: title, location: location, description: description});
				now.createSession(this.model, function(sesh) {
					self.userSeshs.add(sesh);
					console.log(sesh.id)
					now.inviteFBFriends(friends, sesh._id); // Post invites on FB.
					// location.href='/sessions/' + sesh._id
				});
			} else {
				$("#title-form").attr("class", "control-group")
				$("#date-form").attr("class", "control-group")
				$('#title-error').text('')
				$('#date-error').text('')
				if (!title) {
					$("#title-form").attr("class", "control-group error")
					$('#title-error').text('Please enter a title.')
				}
				if  (!day || day - today <= 0) {
					$("#date-form").attr("class", "control-group error")
					$('#date-error').text('Please provide a date in the future.')
				}
				
			}
		},

		hrCheck:function (time) {
			var hour = parseInt(time[0])
			var min = parseInt(time[1])
			console.log('hour: ' + hour + " min: " + min)
			if (hour != NaN && min != NaN && hour > 0 && hour < 13 && min >= 0 && min < 60) {
				return true
			} else {
				console.log('fails')
				return false
			}
		},

		setTime: function (day, time) {
			var hour = parseInt(time[0])
			var min = parseInt(time[1])
			if ($('#pm-input').attr('class') == 'btn active' && hour < 12) {
					day.setHours(hour + 12)
			} else if ($('#am-input').attr('class') == 'btn first-form active' && hour == 12){
				day.setHours(hour - 12)
			} else {
				day.setHours(hour)
			}
			day.setMinutes(min)
			console.log(day.toString())
		}
	});
			

  return SeshCreationView;
});

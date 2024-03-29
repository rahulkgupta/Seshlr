define([
    'jquery',
    'jui',
    'underscore',
    'backbone',
    'bs',

    'models/user',
    'models/sesh',

    'collections/usercoursescollection',
    'collections/userseshscollection',
    'collections/fbfriendscollection',

    'text!/../templates/seshcreate.html',
    
], function($, Jui, _, Backbone, bs, User, SeshCreateModel, Courses, UserSeshs, FBFriends, seshcreationTemplate){
    var SeshCreationView = Backbone.View.extend ({
        
    
        events: {
            'click #create-sesh' : 'showSeshCreation',
            'click #submit-sesh'    : 'submitSeshCreation',
            'click .get-fb' : 'fetchFriends',
            'keyup #fbfriends-input' : 'addFriend',
            'click .friendtag' : 'removeFriendTag',
            'submit #create-sesh-form' : 'submitSeshCreation',
            'click #pm-input' : 'togglePM',
            'click #am-input' : 'toggleAM',
            'focusin #time-input' : "clearTime",
            'focusout #time-input' : 'resetTime',
        },

        initialize: function(){
            this.courses = Courses.initialize();
            this.user = User.initialize()
            this.seshs = UserSeshs.initialize()
            var self = this
            this.user.on("change", function () {
                self.courses.reset(self.user.get('classes'))
                self.seshs.reset(self.user.get('seshs'))
                self.render()
            })
            // this.seshs.on('reset', function () {
            //     console.log(self.seshs)
            //     self.render()
            // })
            this.model = new SeshCreateModel;
            this.user.fetchUser()
        },

        fetchFriends: function(event) {
            event.preventDefault();
            // Bootstrap button stuff broken, this is good for now.
            $('.get-fb').addClass('disabled');
            $('.get-fb').html('One moment please...');
            this.fbfriends = new FBFriends;
            this.fbfriends.fetch({
                data: {access_token: this.user.get('access_token')}, 
                success: function (model, response) {
                    console.log(response);
                },
                error: function(model, response) {
                    console.log(response);
                },
                processData: true,
            })
            this.fbfriends.on('reset', function() {
                typeahead_list = []
                this.fbfriends.each(function(friend) {
                    typeahead_list.push([friend.get('id'), friend.get('name')]);
                });
                fb_input = $('#fbfriends-input').typeahead();
                fb_input.data('typeahead').source = typeahead_list;
                fb_input.data('typeahead').ishidden = true;
                $('.get-fb').hide();
                $('.fb-group').removeClass('hidden');
                $('#fbfriends-input').focus();
                $('#friendtag-container').data('value-hidden', []);
            }, this);
        },

        removeFriendTag: function(event) {
            var id = this.$(event.currentTarget).attr("data-value-hidden")
            var lst = this.$('#friendtag-container').data('value-hidden')
            this.$('#friendtag-container').data('value-hidden').splice(lst.indexOf(id), 1);
            console.log(lst)
            this.$(event.currentTarget).remove();
        },

        addFriend: function(event) {
            if (event.keyCode == 13) {
                var newid = this.$('#fbfriends-input').attr('data-value-hidden')
                var close = '<a href="#" class="friendtag-close"><i class="icon-remove icon-white"></i></a>'
                var newtag = this.$('#friendtag-container').append('<button class="btn btn-primary friendtag" data-value-hidden="' + newid + '">' + $('#fbfriends-input').val() + close + '</button>');
                this.$('#friendtag-container').data('value-hidden').push(newid);
                console.log(newtag.data('value-hidden'));
                this.$('#fbfriends-input').val('');
            }
        },

        showSeshCreation: function (event) {
            this.$('#sesh-form').modal()
            $('#ui-datepicker-div').css('display','none');
            var date = new Date();
            if (this.$('#time-input').val() == "") {
                this.$('#date-input').datepicker('setDate', date)
                this.setTimeInput(date)
            }
            
        },
        
        setTimeInput: function(date) {
            var hr = date.getHours() + 1;
            if (hr % 24 == 0) {
                hr = 12;
                this.$('#am-input').attr('class','btn first-form active')
            } else if (hr < 12) {
                this.$('#am-input').attr('class','btn first-form active')
            } else if (hr == 12) {
                this.$('#pm-input').attr('class','btn active')
            } else if (hr > 12) {
                hr = hr - 12
                this.$('#pm-input').attr('class','btn active')
            }
            var hrstr = hr + ":00"
            this.$('#time-input').val(hrstr)
        },

        render: function () {
            var data = {
                _: _,
                user: this.user,
                courses: this.courses.models,
            };
            var compiledTemplate = _.template( seshcreationTemplate, data );
            $(this.el).html(compiledTemplate)
            this.$('#date-input').datepicker()

        },

        clearTime: function(event) {
            this.$('#time-input').val("")
        },

        resetTime: function(event) {
            if (this.$('#time-input').val() == "") {
                var date = new Date();
                this.setTimeInput(date)
            }
        },

        togglePM: function (event) {
            this.$('#am-input').removeClass('active')
            this.$('#am-input').attr('class','btn first-form')
            this.$('#pm-input').attr('class','btn active')
        },

        toggleAM: function (event) {
            this.$('#pm-input').removeClass('active')
            this.$('#pm-input').attr('class','btn')
            this.$('#am-input').attr('class','btn first-form active')
        },

        submitSeshCreation: function (event) {
            mixpanel.track("Attempting Sesh Creation")
            var friends = this.$('#friendtag-container').data('value-hidden')
            var day = this.$('#date-input').datepicker('getDate');
            var today = new Date();
            console.log(today)
            var daystring = this.$('#date-input').val();
            var time = this.$('#time-input').val().split(':');
            if (!this.hrCheck(time)) {
                this.$("#date-form").attr("class", "control-group error")
                this.$('#date-error').text('Please provide a proper time.')
                return
            }
            var course = this.$('#select-course-input').val();
            var title = this.$('#title-input').val();
            var description = this.$('#description-input').val();
            this.setTime(day,time)
            if (title && day && day > today) {
                this.$('#sesh-form').modal("hide")
                var self = this;
                this.model.set({time: day, created: today, course: course, title: title, location: location, description: description});
                this.model.save(null,{
                    success: function (models, resp) {
                        self.model = new SeshCreateModel
                        mixpanel.track("Created Sesh")
                        resp.course = self.courses.get(resp.course).attributes
                        self.user.set('seshs', _.union([resp], self.user.get('seshs')), {silent:true})
                        self.user.trigger('change')
                        self.seshs.add(resp)

                    },
                    error: function (models, resp) {
                        console.log("error")
                    }
                })
            } else {
                this.$("#title-form").attr("class", "control-group")
                this.$("#date-form").attr("class", "control-group")
                this.$('#title-error').text('')
                this.$('#date-error').text('')
                if (!title) {
                    this.$("#title-form").attr("class", "control-group error")
                    this.$('#title-error').text('Please enter a title.')
                }
                if  (!day || day - today <= 0) {
                    this.$("#date-form").attr("class", "control-group error")
                    this.$('#date-error').text('Please provide a date in the future.')
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
            if (this.$('#pm-input').attr('class') == 'btn active' && hour < 12) {
                    day.setHours(hour + 12)
            } else if (this.$('#am-input').attr('class') == 'btn first-form active' && hour == 12){
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

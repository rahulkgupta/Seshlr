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

    'text!/../templates/sidebar/sidecreate.html',
    
], function($, Jui, _, Backbone, bs, 
    User, SeshCreateModel, Courses, UserSeshs, FBFriends, 
    Template){
    var SidebarCreateView = Backbone.View.extend ({
        
    
        events: {
            'click #side-create-sesh' : 'showSeshCreation',
            'click #side-submit-sesh'    : 'submitSeshCreation',
            'click .get-fb' : 'fetchFriends',
            'keyup #side-fbfriends-input' : 'addFriend',
            'click .friendtag' : 'removeFriendTag',
            'submit #side-create-sesh-form' : 'submitSeshCreation',
            'click #side-pm-input' : 'togglePM',
            'click #side-am-input' : 'toggleAM',
            'focusin #side-time-input' : "clearTime",
            'focusout #side-time-input' : 'resetTime',
        },

        initialize: function(){
            this.courses = Courses.initialize();
            this.user = User.initialize()
            this.seshs = UserSeshs.initialize()
            var self = this
            self.courses.reset(self.user.get('classes'))
            self.seshs.reset(self.user.get('seshs'))
            self.render()
            // this.seshs.on('reset', function () {
            //     console.log(self.seshs)
            //     self.render()
            // })
            this.model = new SeshCreateModel;
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
                fb_input = $('#side-fbfriends-input').typeahead();
                fb_input.data('typeahead').source = typeahead_list;
                fb_input.data('typeahead').ishidden = true;
                $('.get-fb').hide();
                $('.fb-group').removeClass('hidden');
                $('#side-fbfriends-input').focus();
                $('#side-friendtag-container').data('value-hidden', []);
            }, this);
        },

        removeFriendTag: function(event) {
            var id = this.$(event.currentTarget).attr("data-value-hidden")
            var lst = this.$('#side-friendtag-container').data('value-hidden')
            this.$('#side-friendtag-container').data('value-hidden').splice(lst.indexOf(id), 1);
            console.log(lst)
            this.$(event.currentTarget).remove();
        },

        addFriend: function(event) {
            if (event.keyCode == 13) {
                var newid = this.$('#side-fbfriends-input').attr('data-value-hidden')
                var close = '<a href="#side-" class="friendtag-close"><i class="icon-remove icon-white"></i></a>'
                var newtag = this.$('#side-friendtag-container').append('<button class="btn btn-primary friendtag" data-value-hidden="' + newid + '">' + $('#side-fbfriends-input').val() + close + '</button>');
                this.$('#side-friendtag-container').data('value-hidden').push(newid);
                console.log(newtag.data('value-hidden'));
                this.$('#side-fbfriends-input').val('');
            }
        },

        showSeshCreation: function (event) {
            mixpanel.track("Showing Sesh Creation")
            this.$('#side-sesh-form').modal()
            $('#ui-datepicker-div').css('display','none');
            var date = new Date();
            if (this.$('#side-time-input').val() == "") {
                this.$('#side-date-input').datepicker('setDate', date)
                this.setTimeInput(date)
            }
            
        },
        
        setTimeInput: function(date) {
            var hr = date.getHours() + 1;
            if (hr % 24 == 0) {
                hr = 12;
                this.$('#side-am-input').attr('class','btn first-form active')
            } else if (hr < 12) {
                this.$('#side-am-input').attr('class','btn first-form active')
            } else if (hr == 12) {
                this.$('#side-pm-input').attr('class','btn active')
            } else if (hr > 12) {
                hr = hr - 12
                this.$('#side-pm-input').attr('class','btn active')
            }
            var hrstr = hr + ":00"
            this.$('#side-time-input').val(hrstr)
        },

        render: function () {
            var data = {
                _: _,
                user: this.user,
                courses: this.courses.models,
            };
            var compiledTemplate = _.template( Template, data );
            $(this.el).html(compiledTemplate)
            this.$('#side-date-input').datepicker()

        },

        clearTime: function(event) {
            this.$('#side-time-input').val("")
        },

        resetTime: function(event) {
            if (this.$('#side-time-input').val() == "") {
                var date = new Date();
                this.setTimeInput(date)
            }
        },

        togglePM: function (event) {
            this.$('#side-am-input').removeClass('active')
            this.$('#side-am-input').attr('class','btn first-form')
            this.$('#side-pm-input').attr('class','btn active')
        },

        toggleAM: function (event) {
            this.$('#side-pm-input').removeClass('active')
            this.$('#side-pm-input').attr('class','btn')
            this.$('#side-am-input').attr('class','btn first-form active')
        },

        submitSeshCreation: function (event) {
            mixpanel.track("Attempting Sesh Creation")
            var friends = this.$('#side-friendtag-container').data('value-hidden')
            var day = this.$('#side-date-input').datepicker('getDate');
            var today = new Date();
            var daystring = this.$('#side-date-input').val();
            var time = this.$('#side-time-input').val().split(':');
            if (!this.hrCheck(time)) {
                this.$("#side-date-form").attr("class", "control-group error")
                this.$('#side-date-error').text('Please provide a proper time.')
                return
            }
            var course = this.$('#side-select-course-input').val();
            console.log(course)
            var title = this.$('#side-title-input').val();
            var description = this.$('#side-description-input').val();
            this.setTime(day,time)
            if (title && day && day > today) {
                
                this.$('#side-sesh-form').modal("hide")
                var self = this;
                this.model.set({time: day, created: today, course: course, title: title, location: location, description: description});
                this.model.save(null,{
                    success: function (models, resp) {
                        mixpanel.track("Finished Sesh Creation")
                        self.model = new SeshCreateModel
                        resp.course = self.courses.get(resp.course).attributes
                        self.user.set('seshs', _.union([resp], self.user.get('seshs')), {silent:true})
                        console.log(self.seshs.url)
                        self.seshs.add(resp)
                    },
                    error: function (models, resp) {
                        console.log("error")
                    }
                })
            } else {
                this.$("#side-title-form").attr("class", "control-group")
                this.$("#side-date-form").attr("class", "control-group")
                this.$('#side-title-error').text('')
                this.$('#side-date-error').text('')
                if (!title) {
                    this.$("#side-title-form").attr("class", "control-group error")
                    this.$('#side-title-error').text('Please enter a title.')
                }
                if  (!day || day - today <= 0) {
                    this.$("#side-date-form").attr("class", "control-group error")
                    this.$('#side-date-error').text('Please provide a date in the future.')
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
            if (this.$('#side-pm-input').attr('class') == 'btn active' && hour < 12) {
                    day.setHours(hour + 12)
            } else if (this.$('#side-am-input').attr('class') == 'btn first-form active' && hour == 12){
                day.setHours(hour - 12)
            } else {
                day.setHours(hour)
            }
            day.setMinutes(min)
            console.log(day.toString())
        }
    });
            

  return SidebarCreateView;
});

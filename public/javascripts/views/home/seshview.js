define([
    'jquery',
    'underscore',
    'backbone',

    'models/user',
    'collections/userseshscollection',
    'collections/seshfeedcollection',

    'text!/../templates/seshfeed.html'
], function($, _, Backbone, User, UserSeshs, SeshFeedCollection, seshFeedTemplate){
        var SeshFeedView = Backbone.View.extend({

        tagName:'div',

        events: {
            'click .add-session' : 'addSession',
            'click .remove-session' : 'removeSession'
        },
        initialize: function (sesh, added) {
            this.model = sesh;
            this.added = added;
            this.user = User.initialize()
            this.seshs = UserSeshs.initialize()
            this.seshFeed = SeshFeedCollection.initialize()
            var self = this

            this.user.on("change", function () {
                // self.render()
                self.seshs.reset(self.user.get('seshs'))
                // console.log(self.seshs)
            })
            this.user.fetchUser()

            
        },

        render: function () {   
                var date = new Date(this.model.get('time'))
                var data = {
                    _: _,
                    sesh: this.model,
                    date: date,
                    time: this.getTime(date),
                    added: this.added
                };
                this.added ? $(this.el).attr("class", "sesh-added") : 
                                $(this.el).attr("class", "sesh-notadded")
                var compiledTemplate = _.template( seshFeedTemplate, data );
                this.el.innerHTML = compiledTemplate
                return this
        },
        
        getTime: function(date) {
            var hr = date.getHours();
            var min = date.getMinutes();
            var minstr = min.toString();
            if (min < 10) {
                var zero = '0'
                minstr = zero.concat(minstr)
            }
            var hrtr
            if (hr == 0) {
                hr = 12;
                hrstr = hr + ":" + minstr + " AM"
            } else if (hr < 12) {
                hrstr = hr + ":" + minstr + " AM"
            } else if (hr == 12) {
                hrstr = hr + ":" + minstr + " PM"
            } else if (hr > 12) {
                hr = hr - 12
                hrstr = hr + ":" + minstr + " PM"
            }
            return hrstr
        },


        addSession: function (event) {
            this.model.set('users', 
                _.union([this.user.id], this.model.get('users')), 
                {silent:true})
            this.model.save()
            this.seshs.add(this.model, {silent:true})
            this.user.set('seshs', this.seshs.toJSON())
            this.user.save()
            this.seshFeed.fetch()
        },

        removeSession: function (event) {
            this.seshs.remove(this.model)
            this.user.set('seshs', this.seshs.toJSON())
            this.user.save()
            this.model.set('users', 
                _.without(this.model.get('users'), this.user.id))
            this.model.save()
            this.seshFeed.fetch()

        }
    });
  return SeshFeedView;
});

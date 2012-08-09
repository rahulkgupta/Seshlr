define([
    'jquery',             
    'underscore',
    'backbone',
    'handlebars',
    'views/home/seshcreationview',
    'text!/templates/seshfeedcreate.html'
],  function($, _, Backbone, Handlebars, SeshCreation, Template){
    var seshFeedCreationView = Backbone.View.extend({

     //  events: {
     //     'click #create-sesh' : 'showSeshCreation',
     //  },


     // showSeshCreation: function () {
     //  console.log("hello")
     // },

    initialize: function () {

        // this.courses = new userCrses;
        // this.user = userData.fetch()
        // var self = this
        // this.user.bind("change", function () {
        //    self.courses.reset(self.user.get('classes'))
        // })
        // this.notifications = [];
        // this.seshs = userSeshs.initialize();

        // this.seshs.bind('add', this.addSesh, this)
        this.render();
      },

    render: function () {

        // if (this.notifications.models) {
        //    notif_count = this.notifications.models.length;
        // } else {
        //    notif_count = 0;
        // }
        // console.log(this.user.get('name'))
        console.log('workin')
        var data = {
            _: _,
            $: $,
        };
        var compiledTemplate = Handlebars.compile(Template);
        // $('li#sessions').addClass('selected');
        // $('#sidenav-notifications').hide();
        $(this.el).html(compiledTemplate) 
        var seshCreation = new SeshCreation ({el: this.$('#session-feed-creation')})
      },


    });;
      
    return seshFeedCreationView;
});

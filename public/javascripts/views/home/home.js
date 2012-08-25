define([
    'jquery',             
    'underscore',
    'backbone',
    'handlebars',
    'views/includes/calendar',
    'views/home/seshcreationview',
    'views/home/seshcontainerview',
    'text!/templates/home.html'
],  function($, _, Backbone, Handlebars, CalendarView, SeshCreation, SeshContainer, homeTemplate){
    var homeView = Backbone.View.extend({

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
        var data = {
            _: _,
            $: $,
        };
        var compiledTemplate = Handlebars.compile(homeTemplate);
        // $('li#sessions').addClass('selected');
        // $('#sidenav-notifications').hide();
        $(this.el).html(compiledTemplate) 
        var seshCreation = new SeshCreation ({el: this.$('#session-creation')})
        var seshContainer = new SeshContainer({el: this.$('.session-container')})
      },


    });;
      
    return homeView;
});

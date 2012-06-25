define([
      'jquery',
      'underscore',
      'backbone',
      'handlebars',
      'views/includes/calendar',
      'text!/templates/home.html'
], function($, _, Backbone, Handlebars, calendarView, homeTemplate){
   var homeView = Backbone.View.extend({

      events: {
         
      },


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
            calendar: "test",
            _: _,
            $: $,
         };
         var compiledTemplate = Handlebars.compile(homeTemplate);
         // $('li#sessions').addClass('selected');
         // $('#sidenav-notifications').hide();
         $(this.el).html(compiledTemplate) 
         var calendar = new calendarView ({el: this.$('#calendar-container')})
      },


   });;
      
  return homeView;
});

define([
  'jquery',
  'underscore',
  'backbone',
  'libs/handlebars/handlebars'
  'models/user',
   'collections/usernotifscollection',
   'collections/usercoursescollection',
   'collections/userseshscollection',
   'text!/templates/sidebar/sidebar.html',
], function($, _, Backbone, hbar, userData, userNotifs, userCrses, userSeshs, sidebarTemplate){
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
      },

      render: function () {

         // if (this.notifications.models) {
         //    notif_count = this.notifications.models.length;
         // } else {
         //    notif_count = 0;
         // }
         // console.log(this.user.get('name'))

         console.log(this.courses)
         var data = {
            _: _,
            $: $,
            user: this.user,
            seshs: this.seshs.models,
            courses: this.courses.models,
            notifications: this.notifications.models,
            notif_count: this.notifications
         };
         var compiledTemplate = hbar.compile( sidebarTemplate, data );
         $(this.el).html(compiledTemplate);
         // $('li#sessions').addClass('selected');
         // $('#sidenav-notifications').hide();
         return this;
      },

       settings: function () {
         console.log("hello")
         Backbone.history.navigate('settings', true)
      },
   });;
      
  return new sidebarView;
});

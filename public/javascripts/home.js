// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone', 
	'now',
	'views/home/user'
], function($, _, Backbone, now, userView){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		alert(locals.userId);
  }

  return {
    initialize: initialize
  };
});

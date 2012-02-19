// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone', 
	'now',
	'views/home/userview'
], function($, _, Backbone, now, userView){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		var uView = new userView;
  }

  return {
    initialize: initialize
  };
});

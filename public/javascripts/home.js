// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone', 
	'now',
	'views/home/userview'
	'views/home/sessionfeedview'
], function($, _, Backbone, now, uView,sfView){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		var userView = new uView;
		var sessionFeedView = new sfView;
		
		
  }

  return {
    initialize: initialize
  };
});

define([
  'jquery',
  'underscore',
  'backbone',
	'views/sidebar/sidebar'
], function($, _, Backbone, sidebarView){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
		var sidebarView = new sidebarView;
		
		
  }

  return {
    initialize: initialize
  };
});
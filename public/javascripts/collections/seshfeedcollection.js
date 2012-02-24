define([
  'underscore',
  'backbone',
  'models/seshfeed'
], function(_, Backbone, SessionFeedModel){
  var SeshFeedCollection = Backbone.Collection.extend({
    
		model: SessionFeedModel,
		
		url: '/apis/seshfeed'
		


  });
 
  return SeshFeedCollection;
});

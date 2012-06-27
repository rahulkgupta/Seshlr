define([
  'underscore',
  'backbone',
], function( _, Backbone){
	var deptModel = Backbone.Model.extend({
        
        url: '/apis/depts',

        parse: function (resp) {
            this.set({depts : resp}) 
            _.forEach(this.get('depts'), function (dept) {
                dept = '"' + dept + '"'
            })
        }
	});
  return deptModel;
});

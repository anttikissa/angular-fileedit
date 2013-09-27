define(['backbone'], function(Backbone) {
	var File = Backbone.Model.extend({
		defaults: {
			name: '',
			content: ''
		},

		initialize: function() {
			this.fetch();
		},

		idAttribute: 'name',

		urlRoot: '/files'
	});

	return File;
});

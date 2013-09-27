define(['backbone'], function(Backbone) {
	var DirectoryEntry = Backbone.Model.extend({
		defaults: {
			name: '',
			length: 0,
			type: 'file' // or 'dir'
		},

		initialize: function() {
			this.on('change:content', this.nameChanged);
		},

		nameChanged: function(what, to) {
			this.set('length', to.length);
		},

		idAttribute: 'name'
	});

	return DirectoryEntry;
});

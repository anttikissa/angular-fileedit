define(['backbone'], function(Backbone) {
	var DirectoryEntry = Backbone.Model.extend({
		defaults: {
			name: '',
			length: 0,
			type: 'file', // or 'dir'
			expanded: false // applies only if it's a dir
		},

		initialize: function() {
			this.on('change:content', this.contentChanged);
		},

		contentChanged: function(what, to) {
			// TODO sets length in characters, should be in bytes
			this.set('length', to.length);
		},

		idAttribute: 'name'
	});

	return DirectoryEntry;
});

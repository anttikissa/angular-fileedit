define(['backbone'], function(Backbone) {
	var File = Backbone.Model.extend({
		defaults: {
			name: 'unnamed',
			length: 0,
			content: ''
		},

		isDir: function() {
			var name = this.get('name');
			return name[name.length - 1] === '/';
		},

		initialize: function() {
			this.on('change:content', this.nameChanged);
		},

		nameChanged: function(what, to) {
			this.set('length', to.length);
		},

		idAttribute: 'name'
	});

	return File;
});

define(['backbone', 'util', 'models/directoryentry'],
		function(Backbone, util, DirectoryEntry) {
	var rootUrl = '/files';

	var Directory = Backbone.Collection.extend({
		model: DirectoryEntry,

		initialize: function(options) {
			options = options || {};
			this.path = (options.path || '');
			this.url = util.joinPaths(rootUrl, this.path);
		}
	});

	return Directory;
});

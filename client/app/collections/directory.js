define(['backbone', 'util', 'models/directoryentry'],
		function(Backbone, util, DirectoryEntry) {
	var rootUrl = '/files';

	var Directory = Backbone.Collection.extend({
		model: DirectoryEntry,

		initialize: function(options) {
			options = options || {};
			this.url = util.joinPaths(rootUrl, (options.path || ''));
		}
	});

	return Directory;
});

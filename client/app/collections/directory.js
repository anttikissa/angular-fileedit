define(['backbone', 'util', 'models/file'], function(Backbone, util, File) {
	var rootUrl = '/files';

	var Directory = Backbone.Collection.extend({
		model: File,

		initialize: function(options) {
			options = options || {};
			this.url = util.joinPaths(rootUrl, (options.path || ''));
		}
	});

	return Directory;
});

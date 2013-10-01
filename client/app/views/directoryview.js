define(
	['backbone', 'views/directoryentryview', 'collections/directory', 'app', 'util'],
	function(Backbone, DirectoryEntryView, Directory, app, util) {
	var DirectoryView = Backbone.View.extend({
		tagName: 'ul',

		initialize: function(options) {
			options = options || {};
			this.$parent = options.$parent;
			this.$parent.append(this.$el);

			this.listenTo(this.model, 'reset', this.addAll);
			var xhr = this.model.fetch({ reset: true });
			xhr.error(function(xhr) {
				alert("Error loading files: " + xhr.responseText);
			});
			xhr.success(function(what) {
				app.trigger('initialLoad');
			});
		},

		addOne: function(directoryEntry) {
			var view = new DirectoryEntryView({ model: directoryEntry });
			this.$el.append(view.render().el);

			if (directoryEntry.get('type') === 'dir') {
				var name = directoryEntry.get('name');
				var dirPath = util.joinPaths(this.model.path, name);
				var directory = new Directory({ path: dirPath });
				var directoryView = new DirectoryView(
					{ model: directory, $parent: view.$el }
				);
			}
		},

		addAll: function() {
			var that = this;
			this.$el.empty();
			this.model.each(function(directoryEntry) {
				that.addOne(directoryEntry);
			});
		}
	});

	return DirectoryView;
});

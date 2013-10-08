define(
	['underscore', 'backbone', 'views/directoryentryview', 'collections/directory', 'app', 'util'],
	function($, Backbone, DirectoryEntryView, Directory, app, util) {
	var DirectoryView = Backbone.View.extend({
		tagName: 'ul',

		initialize: function(options) {
			options = options || {};
			this.$parent = options.$parent;
			// This code is duplicated in DirectoryEntryView#render.
			// Which is ugly.
			this.$parent.append(this.$el);

			this.listenTo(this.model, 'reset', this.addAll);
		},

		show: function() {
			var xhr = this.model.fetch({ reset: true });
			xhr.error(function(xhr) {
				alert("Error loading files: " + xhr.responseText);
			});
			xhr.success(function(what) {
				app.trigger('initialLoad');
			});
		},

		hide: function() {
			this.$el.empty();
		},

		addOne: function(directoryEntry) {
			var view = new DirectoryEntryView({ model: directoryEntry });
			this.$el.append(view.render().el);

			if (directoryEntry.get('type') === 'dir') {
				var name = directoryEntry.get('name');
				var dirPath = util.joinPaths(this.model.path, name);
				var directory = new Directory({ path: dirPath });
				view.directoryView = new DirectoryView(
					{ model: directory, $parent: view.$el }
				);

				// Expand directory if it leads to the currently open file.
				var currentPath = window.location.hash.replace('#', '');
				var dirPath = view.getAbsolutePath();
				if (currentPath.indexOf(dirPath) != -1) {
					directoryEntry.set('expanded', true);
				}
			}
		},

		addAll: function() {
			var that = this;
			this.$el.empty();
			this.model.each(function(directoryEntry) {
				that.addOne(directoryEntry);
			});
		},

		render: function() {
			this.addAll();
			return this;
		}
	});

	return DirectoryView;
});

define(
	['backbone', 'views/directoryentryview', 'collections/directory', 'app'],
	function(Backbone, DirectoryEntryView, Directory, app) {
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

			console.log("DirectoryEntry ", directoryEntry);
			if (directoryEntry.get('type') === 'dir' || directoryEntry.get('name') === 'node_modules' ) {
				console.log("MAUGHT");
				var files2 = new Directory({ path: directoryEntry.get('name') });
				var files2View = new DirectoryView({ model: files2, $parent: view.$el });
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

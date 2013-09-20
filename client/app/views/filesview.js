define(
	['backbone', 'views/filenameview', 'collections/files', 'app'],
	function(Backbone, FilenameView, Files, app) {
	var FilesView = Backbone.View.extend({
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

		addOne: function(file) {
			var view = new FilenameView({ model: file });
			this.$el.append(view.render().el);

			if (file.isDir() && file.get('name') === 'node_modules/' ) {
				var files2 = new Files({ path: file.get('name') });
				var files2View = new FilesView({ model: files2, $parent: view.$el });
			}
		},

		addAll: function() {
			var that = this;
			this.$el.empty();
			this.model.each(function(file) {
				that.addOne(file);
			});
		}
	});

	return FilesView;
});

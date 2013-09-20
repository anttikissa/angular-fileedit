define(['backbone', 'underscore', 'util', 'app'], function(Backbone, _, util, app) {
	var FilenameView = Backbone.View.extend({
		template: _.template(app.templates.filename),

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		tagName: 'li',

		render: function() {
			var data = this.model.toJSON();
			// TODO ugly, store path as a separate piece of data
			var parentPath = this.model.collection.url.replace('/files', '');
			_.extend(data, {
				isDir: this.model.isDir(),
				path: util.joinPaths(parentPath, this.model.get('name'))
			});
			this.$el.html(this.template(data));
			return this;
		}
	});

	return FilenameView;
});

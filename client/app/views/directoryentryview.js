define(
	['backbone', 'underscore', 'util', 'app'],
	function(Backbone, _, util, app) {
		var DirectoryEntryView = Backbone.View.extend({
			template: _.template(app.templates.filename),

			initialize: function() {
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'change:expanded', this.expandedChange);
			},

			expandedChange: function() {
				if (this.model.get('expanded')) {
					this.$el.addClass('expanded');
					this.directoryView.show();
				} else {
					this.$el.removeClass('expanded');
					this.directoryView.hide();
				}
			},

			events: {
				'click > a[data-type="dir"]': 'clickDir'
			},

			clickDir: function(ev) {
				ev.preventDefault();
				this.model.set('expanded', !this.model.get('expanded'));
			},

			tagName: 'li',

			getAbsolutePath: function() {
				// extend directory entry's data with the complete path to it
				var parentPath = this.model.collection.url.replace('/files', '');
				var path = util.joinPaths(parentPath, this.model.get('name'));
				return path;
			},

			render: function() {
				var data = _.extend(this.model.toJSON(), { path: this.getAbsolutePath() });

				this.$el.html(this.template(data));

				if (this.directoryView && this.model.get('expanded')) {
					var dirView = this.directoryView.render().$el;
					this.$el.append(dirView);
				}

				return this;
			}
		});

		return DirectoryEntryView;
	}
);

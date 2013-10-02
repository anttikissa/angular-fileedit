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
				// TODO figure out what now
				console.log("Expanded changed!", this);
			},

			events: {
				'click > a[data-type="dir"]': 'clickDir'
			},

			clickDir: function(ev) {
				ev.preventDefault();
			},

			tagName: 'li',

			render: function() {
				var parentPath = this.model.collection.url.replace('/files', '');
				var path = util.joinPaths(parentPath, this.model.get('name'));

				var data = _.extend(this.model.toJSON(), { path: path });
				this.$el.html(this.template(data));
				return this;
			}
		});

		return DirectoryEntryView;
	}
);

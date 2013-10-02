define(
	['backbone', 'underscore', 'util', 'app'],
	function(Backbone, _, util, app) {
		var DirectoryEntryView = Backbone.View.extend({
			template: _.template(app.templates.filename),

			initialize: function() {
				this.listenTo(this.model, 'change', this.render);
//				this.listenTo(this.model, 'change:expanded', this.expandedChange);

//				function rand() {
//					return Math.floor(Math.random() * 256).toString(16);
//				}
//				this.$el.css('border', '3px dashed #' + rand() + rand() + rand());
			},

			expandedChange: function() {
				console.log("Expanded changed!", this);
				return;
				// HACK
/*				var parent = this.$el.find('ul');

				var DirectoryView = DirectoryEntryView.DirectoryView;
				// names & paths messing up...
				var thisPath = this.model.get('name');
				console.log("model", this.model);
				console.log("dirview", DirectoryView);
				if (this.model.get('expanded')) {
					var name = this.model.get('name');
					var dirPath = util.joinPaths(thisPath, name);
					var directory = new Directory({ path: dirPath });
					var directoryView = new DirectoryView(
						{ model: directory, $parent: parent }
					);
				}
*/

			},

			events: {
				'click > a[data-type="dir"]': 'clickDir'
			},

			clickDir: function() {
				console.log("clickDir");
				var expanded = !this.model.get('expanded');
				this.model.set('expanded', expanded);
				if (expanded) {
					this.$el.addClass('expanded');
				} else {
					this.$el.removeClass('expanded');
				}
			},

			tagName: 'li',

			render: function() {
				console.log("Rendering directoryEntry.");
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

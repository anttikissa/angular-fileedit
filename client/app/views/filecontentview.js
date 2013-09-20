// TODO app.files dependency
define(['backbone', 'app'], function(Backbone, app) {
	var FileContentView = Backbone.View.extend({
		el: '#content',

		initialize: function() {
			this.$name = this.$el.find('.name');
			this.$filename = this.$el.find('.filename');
			this.$textarea = this.$el.find('textarea');
			this.$status = this.$el.find('.status');
			this.$save = this.$el.find('.save');
			this.$refresh = this.$el.find('.refresh');
			this.setModel(null);
		},

		events: {
			'click .save': 'save',
			'click .refresh': 'refresh'
		},

		setFile: function(name) {
			var model = app.files.findWhere({ name: name });
			this.setModel(model);
		},

		setModel: function(model) {
			if (this.model) {
				this.stopListening(this.model);
			}
			this.model = model;
			if (this.model) {
				this.listenTo(this.model, 'sync', this.render);
			}
			this.render();
		},

		render: function() {
			var hasModel = this.model != null;

			if (hasModel) {
				this.$filename.html(this.model.get('name'));
				this.$textarea.val(this.model.get('content'))
					.attr('readonly', false);
			} else {
				this.$filename.html('(no file)');
				this.$textarea.val('')
					.attr('readonly', true);
			}

			this.$save.attr('disabled', !hasModel);
			this.$refresh.attr('disabled', !hasModel);

			return this;
		},

		save: function() {
			if (this.model) {
				// TODO report "saving..." state
				this.$status.html('Saving...');
				var that = this;
				var xhr = this.model.save({
					content: this.$textarea.val()
				}, {
					wait: true
				});
				xhr.fail(function(xhr) {
					alert("Error saving file: " + xhr.responseText);
					that.$status.html('Error saving file.');
				});
				xhr.success(function(what) {
					that.$status.html('Saved.');
				});
			}
		},

		refresh: function() {
			if (this.model) {
				var xhr = this.model.fetch();
				xhr.fail(function(xhr) {
					console.log("Failed to refresh", xhr.responseText);
				});
				xhr.success(function(what) {
	//				console.log("Success", what);
				});
			}
		}

	});

	return FileContentView;
});


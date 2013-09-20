require.config({
	baseUrl: 'app',

	paths: {
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizr/modernizr',
		underscore: '../components/underscore/underscore',
		backbone: '../components/backbone/backbone'
	},

	shim: {
		'underscore': {
			exports: '_'
		},

		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});

var app = {
	templates: {
		filename: "<a href='#<%= path %>'>\n" +
			"    <%= name %><% if (!isDir) { %>    (<%= length %> bytes) <% } %>\n" +
			"</a>"
	}
};

function main($, _, Backbone) {
	_.extend(app, Backbone.Events);

	var File = Backbone.Model.extend({
		defaults: {
			name: 'unnamed',
			length: 0,
			content: ''
		},

		isDir: function() {
			var name = this.get('name');
			return name[name.length - 1] === '/';
		},

		initialize: function() {
			this.on('change:content', this.nameChanged);
		},

		nameChanged: function(what, to) {
			this.set('length', to.length);
		},

		idAttribute: 'name'
	});

	var rootUrl = '/files';

	// A hacky path.join() lookalike
	function joinPaths(p1, p2) {
		console.log('joinPaths', p1, '+', p2);
		var result = p1 + ((p1[p1.length - 1] === '/') ? '' : '/') + p2;
		result = result.replace(/\/+/g, '\/');
		console.log('result', result);
		return result;
	}

	var Files = Backbone.Collection.extend({
		model: File,

		initialize: function(options) {
			options = options || {};
			this.url = joinPaths(rootUrl, (options.path || ''));
		}
	});

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
				path: joinPaths(parentPath, this.model.get('name'))
			});
			this.$el.html(this.template(data));
			return this;
		}
	});

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

	var Workspace = Backbone.Router.extend({
		routes: {
			'*name': 'setFile'
		},

		setFile: function(name) {
			app.fileContentView.setFile(name);
		}
	});

	app.files = new Files({ path: '/' });
	app.filesView = new FilesView({ model: app.files, $parent: $('#root') });

	app.fileContentView = new FileContentView();
	app.router = new Workspace();

	app.once('initialLoad', function() {
		Backbone.history.start();
	});
}

require(['jquery', 'modernizr', 'underscore', 'backbone'],
	function($, modernizr, _, Backbone) {
	main($, _, Backbone);
});


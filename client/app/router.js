define(['backbone', 'app'], function(Backbone, app) {
	var Router = Backbone.Router.extend({
		routes: {
			'*name': 'setFile'
		},

		setFile: function(name) {
			app.fileContentView.setFile(name);
		}
	});

	return Router;
});

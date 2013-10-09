require.config({
	baseUrl: 'app',

	paths: {
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizr/modernizr',
		codemirror: '../components/codemirror/lib/codemirror',
		angular: '../components/angular/angular'
	},

	shim: {
		'angular': {
			exports: 'angular'
		},

		'codemirror': {
			exports: 'CodeMirror'
		}
	}
});

require(
	['jquery', 'modernizr', 'angular', 'app'],
	function($, modernizr, angular, app) {

/*	var root = new Directory({ path: '/' });
	app.directoryView = new DirectoryView({ model: root, $parent: $('#root') });
	app.directoryView.show();

	app.fileContentView = new FileContentView();
	app.router = new Router();

	app.once('initialLoad', function() {
		Backbone.history.start();
	}); */
	console.log("Got angular", angular);
});


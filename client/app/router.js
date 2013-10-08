define(['backbone', 'jquery', 'app', 'util'], function(Backbone, $, app, util) {
	var Router = Backbone.Router.extend({
		routes: {
			'*name': 'setFile'
		},

		setFile: function(name) {
			function updateBreadcrumb() {
				var breadcrumbs = name ? name.split('/') : [];
				var crumbsSoFar = [''];
				var $bc = $('.breadcrumb').empty();
				function pushCrumb(link, text) {
					$bc.append('<li><a href="' + link + '">' + text + '</a></li>');
				}
				pushCrumb('#', '[root]');
				breadcrumbs.forEach(function(crumb) {
					crumbsSoFar.push(crumb);
					var crumbLink = '#' + crumbsSoFar.join('/');
					pushCrumb(crumbLink, crumb);
				});
			}

			updateBreadcrumb();

			app.fileContentView.setFile(name);
		}
	});

	return Router;
});

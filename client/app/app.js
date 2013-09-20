// Globals, so long as they are needed

define(['underscore', 'backbone'], function(_, Backbone) {
	var app = {
		templates: {
			filename: "<a href='#<%= path %>'>\n" +
				"    <%= name %><% if (!isDir) { %>    (<%= length %> bytes) <% } %>\n" +
				"</a>"
		}
	};

	_.extend(app, Backbone.Events);

	return app;
});

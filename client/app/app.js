// Globals, so long as they are needed

define(['underscore', 'backbone'], function(_, Backbone) {
	var app = {
		templates: {
			filename:
				"<a data-type='<%= type %>' href='#<%= path %>'>" +
				"<%= name %><% if (type === 'file') { %>    (<%= length %> bytes) <% } %>" +
				"</a>"
		}
	};

	_.extend(app, Backbone.Events);

	return app;
});

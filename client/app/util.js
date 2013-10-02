define([], function() {
	var util = {};

	// A crude but effective path.join() lookalike
	util.joinPaths = function(p1, p2) {
		var result = p1 + '/' + p2;
		result = result.replace(/\/+/g, '\/');
		return result;
	};

	return util;
});

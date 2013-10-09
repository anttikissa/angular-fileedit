/*require.config({
	baseUrl: 'app',

	paths: {
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizr/modernizr',
		codemirror: '../components/codemirror/lib/codemirror',
		angular: '../components/angular/angular',
		'angular-resource': '../components/angular-resource/angular-resource'
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
	['jquery', 'modernizr', 'angular', 'angular-resource', 'project'],
	function($, modernizr, angular, angularResource, project) {
*/

var angular;
var $resource;

console.log("Got angular", angular);
console.log("Got resource", $resource);
//});


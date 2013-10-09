// Globals, so long as they are needed

var angular;

angular.module('project', ['ngResource']);

function FilesCtrl($scope, $resource) {

	console.log("resource", $resource);
	var Files = $resource('/files/:filename/', { filename: '@name' });

	$scope.files = Files.query();

//	$scope.files = [
//		{ name: 'foo.xyz', length: 123 },
//		{ name: 'bar.txt', length: 55 }
//	];
}

console.log("App!");


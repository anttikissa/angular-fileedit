// Globals, so long as they are needed

//var $resource;

//define(['angular'], function(angular) {
	angular.module('project', ['ngResource']);

	function FilesCtrl($scope) {
		/*
		var Files = $resource('/files/:filename/', { filename: '@name' });

		var files = Files.query(function() {
			console.log("Queried files", files);
		});*/

		$scope.files = [
			{ name: 'foo.xyz', length: 123 },
			{ name: 'bar.txt', length: 55 }
		];
	}

	console.log("App!");
//	return {};
//});

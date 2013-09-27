var path = require('path'),
	fs = require('fs'),
	express = require('express'),
	async = require('async');

// As-simple-as-possible file server.
//
// A file is:
//
// {
//     name: 'name',
//     length: 1234,
//     content: '...'
// }
//
// GET /files          return list of files
// GET /files/<file>   return file contents
// PUT /files/<file>   change file contents
//
// There is no authentication or security.  Errors reading or writing files
// might crash the server.

// Takes express app.
module.exports = function(app) {
	var rootDir = path.join(__dirname, process.env['ROOTDIR'] || '.');

	app.use(express.bodyParser());

	function statFile(rootDir) {
		return function(filename, cb) {
			fs.stat(path.join(rootDir, filename), cb);
		}
	}

	function readFile(rootDir) {
		return function(filename, cb) {
			return fs.readFile(path.join(rootDir, filename), 'utf8', cb);
		}
	}

	app.get('/files/?*', function(req, res) {
		var relativePath = req.params[0];
		var pathname = path.join(rootDir, relativePath);

		fs.stat(pathname, function(err, result) {
			if (err) {
				res.status(404);
				res.end(err.message);
				return;
			}
			var isDirectory = result.isDirectory();
			if (isDirectory) {
				fs.readdir(pathname, function(err, filenames) {
					result = [];
					filenames.forEach(function(filename) {
						if (filename[0] == '.')
							return;
						var stats = fs.statSync(path.join(pathname, filename));
						result.push({
							name: filename,
							length: stats.isDirectory() ? 0 : stats.size,
							type: stats.isDirectory() ? 'dir' : 'file'
						});
					});

					res.end(JSON.stringify(result));
				});
			} else {
				console.log("Reading file...");
				fs.readFile(pathname, 'utf8', function(err, result) {
					console.log("readfile", pathname, "err", err, "result", result);
					if (err) {
						res.status(404);
						res.end(err.message);
					} else {
						res.end(JSON.stringify({ name: relativePath, content: result }));
					}
				});
			}
		});
	});

	app.post('/files', function(req, res) {
		// TODO this happened when? On trying to rename a file?
		console.log("POST, body", req.body);
	});

	app.put('/files/:id', function(req, res) {
		fs.writeFile(path.join(rootDir, req.params.id),
			req.body.content, function(err, result) {
				if (err) {
					res.status(403);
					console.log("Error was", err);
					res.end(err.message);
				} else {
					res.end(JSON.stringify({ result: 'ok' }));
				}
			});
	});
};

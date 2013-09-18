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
// GET /files          return list of files (with their contents!)
// GET /files/<file>   return file contents
// PUT /files/<file>   change file contents
//
// There is no authentication or security.  Errors reading or writing files
// might crash the server.

// Takes express app.
module.exports = function(app) {
	var rootDir = path.join(__dirname, '.');

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

	app.get('/files', function(req, res) {
		fs.readdir(rootDir, function(err, filenames) {
			if (err) throw err;

			filenames = filenames.filter(function(filename) {
				return filename[0] != '.';
			});

			async.map(filenames, statFile(rootDir), function(err, stats) {
				if (err) throw err;

				fileContents = [];

				filenames.forEach(function(filename, idx) {
					if (!stats[idx].isDirectory()) {
						var filePath = path.join(rootDir, filename);
						fileContents.push(fs.readFileSync(filePath, 'utf8'));
					} else {
						fileContents.push('');
					}
				});

				result = filenames.map(function(filename, idx) {
					var stat = stats[idx];
					var content = fileContents[idx];
					//console.log("File content for " + filename + ": " + content);
					return { name: filename, length: stat.size, content: content };
				});
				res.end(JSON.stringify(result));
			});
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

	app.get('/files/:id', function(req, res) {
		var filename = req.params.id;
		fs.readFile(path.join(rootDir, filename), 'utf8', function(err, result) {
			if (err) {
				res.status(404);
				res.end(err.message);
			} else {
				res.end(JSON.stringify({ name: filename, content: result }));
			}
		});
	});
};

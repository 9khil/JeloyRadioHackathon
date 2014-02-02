var http = require('http');
var fs = require('fs');

var server = http.createServer(function(request,response) {
	response.writeHead(200,{"Content-Type" : "text/plain"});
	var output = '';
	fs.readFile('file', {'encoding':'utf-8'}, function(err,data) {
		console.log(err);
		console.log(data);
		if (err) {
			throw err;
		} else {
			var lines = data.trim().split('\n');
			var lastLine = lines.slice(-1)[0];
			response.end(lastLine + "\n");	
		}
	});
});

server.listen(8000);

console.log("server up and running");
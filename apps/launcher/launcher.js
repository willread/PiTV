// var walk = require("walk");
var glob = require("glob");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var path = require("path");

// Initialize app

var app = express();

app.set("port", process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser());

app.get("/files", function(req, res){
	var dir = "/Volumes/Macintosh\ HD/wb/Downloads/complete/"

	glob(path.join(dir, "/**"), {}, function(err, files){
		res.send(files);
	});
});

app.listen(process.env.PORT || 5000);
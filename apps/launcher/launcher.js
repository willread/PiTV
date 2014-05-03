var path = require("path");
var fs = require("fs");
var exec = require("child_process").exec;

// var walk = require("walk");
var glob = require("glob");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

// Initialize app

var app = express();

app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser());

// Maintain a list of video files

var files = [];

var refreshFiles = function(dir){
	glob(path.join(dir, "**/*.{avi,mpg,mpeg,mp4}"), {}, function(err, f){
		files = f;
		console.log("got files", f.length);
	});
};

// Refresh files every so often

/*setInterval(function(){
	refreshFiles(p);	
}, 100000000);*/

var p = "/mnt/osx/Downloads/complete/TV/";

refreshFiles(p);

// File API endpoint

app.get("/files", function(req, res){
	res.send(files);
});

// Playback API endpoing

app.put("/play", function(req, res){
	console.log("playing " + req.body.id);
	exec("omxplayer -o hdmi " + files[req.body.id]);
});

// Start server

app.listen(process.env.PORT || 5000);
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
	glob(path.join(dir, "*.{avi,mpg,mpeg}"), {}, function(err, f){
		files = f;
	});
};

// Refresh files every so often

setInterval(function(){
	refreshFiles("/Users/wb/Downloads");	
}, 10000);

refreshFiles("/Users/wb/Downloads");

// File API endpoint

app.get("/files", function(req, res){
	res.send(files);
});

// Playback API endpoing

app.put("/play/:id", function(req, res){
	exec("omxplayer -o hdmi " + files[req.params.id]);
});

// Start server

app.listen(process.env.PORT || 5000);
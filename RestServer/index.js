/**
 * Created by skaldo on the 07.05.2016
 * As there's nothing yet provided by the Group1,
 * this is the server that simulates the behavior of their
 * backend.
 * 
 * Usage: node index.js -i X
 * X - Iteration number
 */
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

function findLatestIteration(n) {
    var latestIteration = 0;
    fs.readdirSync('../').filter(function (file) {
        if (fs.statSync(path.join('../', file)).isDirectory() && /Iteration_(\d+)/g.test(file)) {
            var it = parseInt(file.match(/\d+/g));
            if (it > latestIteration) {
                latestIteration = it;
            }
        }
    });
    return latestIteration;
}

function checkIteration(n) {
    var ret = false;
    fs.readdirSync('../').filter(function (file) {
        if (fs.statSync(path.join('../', file)).isDirectory() && /Iteration_(\d+)/g.test(file)) {
            if (parseInt(file.match(/\d+/g)) == parseInt(n)) {
                ret = true;
            }
        }
    });
    return ret;
}

var iteration = null;
var port = 3000;
var argv = require('minimist')(process.argv.slice(2));

iteration = parseInt(argv.i);
if (argv.p && parseInt(argv.p)) {
    port = parseInt(argv.p);
}

if (!iteration) {
    iteration = findLatestIteration();
    console.log("No iteration specified, using the latest: " + iteration);
}
else {
    if (isNaN(iteration)) {
        console.log("Iteration is not a number.");
    }
    if (!checkIteration(iteration)) {
        console.log("Iteration " + iteration + " does not exist.");
    }
}

// We have the iteration, let's serve stuffs.
var basePath = "../Iteration_" + iteration + "/RestApi/TestData/";
var busses = require(basePath + "busses.json");
var lines = require(basePath + "lines.json");
var routes = require(basePath + "routes.json");
var stops = require(basePath + "stops.json");
var update = require(basePath + "update.json");
var bus1 = require(basePath + "busses/bus1.json");
var bus2 = require(basePath + "busses/bus2.json");

//Enabling CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/busses', function (req, res) {
    res.send(busses);
});
app.get('/lines', function (req, res) {
    res.send(lines);
});
app.get('/routes', function (req, res) {
    res.send(routes);
});
app.get('/stops', function (req, res) {
    res.send(stops);
});
app.get('/update', function (req, res) {
    res.send(update);
});

app.listen(port, function () {
    console.log('Mock server runs on the port ' + port);
});

app.get('/busses/1',function (req, res){
    res.send(bus1);
})

app.get('/busses/2',function (req, res){
    res.send(bus2);
})
var express = require('express');
var path = require('path');
var router = require('./router');
var app = express();
global.sql = require('./sqlconn');


// all environments
console.log("server started");



//filter
app.use(function(req, res, next){
    if (req.url == "/favicon.ico") return;
    next();
});

sql.connect(function(err) {
    if (err) {
        console.log("Database connections failed");
    } else {
        console.log("We're connected!");
    }
});

var path_requested = path.join(__dirname, 'public');

//app.use(express.logger());
app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
//app.use(app.query);
app.use(express.bodyParser());
app.use(app.router);
app.use(router.route);
app.use(express.compress());
app.use(express.static(path_requested, { maxAge : 3600 }));

app.listen(8888);


//app.use(function(req, res, next){
//    console.log('%s %s', req.method, req.url);
//    next();
//});
//var john = { height: 6.3, weight : 189 };
//john.hair = "brown";
//console.log(JSON.stringify(john));
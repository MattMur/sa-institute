var express = require('express');
var path = require('path');
var app = express();

var user = require('./routes/users');
var teacher = require('./routes/teachers');
var classSubject = require('./routes/class');
var studyCard = require('./routes/studyCards');


// all environments
console.log("server started");


//filter
app.use(function(req, res, next){
    if (req.url == "/favicon.ico") return;
    next();
});

app.use(function(req, res, next) {
    console.log("requestPath: " + req.path);
    next();
})


//app.use(express.logger());
app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
app.use(express.compress());
app.use(express.bodyParser());
//app.use(app.router);

// Routes
app.get('/studycards', studyCard.getAll);
app.post('/studycards', studyCard.post);
app.get('/teachers', teacher.getAll);
app.get('/class', classSubject.getALL);
app.get('/users', user.getAll);

// Static mapping
var path_requested = path.join(__dirname, 'public');
app.use(express.static(path_requested, { maxAge : 3600 }));

// Listen
app.listen(8888);


//app.use(function(req, res, next){
//    console.log('%s %s', req.method, req.url);
//    next();
//});
//var john = { height: 6.3, weight : 189 };
//john.hair = "brown";
//console.log(JSON.stringify(john));
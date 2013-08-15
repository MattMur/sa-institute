var express = require('express');
var path = require('path');
var app = express();

var auth = require('./scripts/authentication');
var user = require('./routes/users');
var teacher = require('./routes/teachers');
var classSubject = require('./routes/class');
var studyCard = require('./routes/studyCards');

console.log("server started");

// Setup
app.use(function(req, res, next){
    if (req.url == "/favicon.ico") return;
    next();
});

app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'NEPHIISCOOL', key: 'inst.sess'}));

// logger
app.use(function(req, res, next) {
    //console.log("sess: " + JSON.stringify(req.session));
    console.log(req.method +" "+ req.path);
    next();
});


// API Routes
app.get('/api/users', auth.basicAuth(express), user.getAll);
app.get('/api/users/:id', auth.basicAuth(express), user.getOne);
app.put('/api/users', user.createNew);
//app.get('/users/:id/studycards', user.getUserStudyCards);
//app.get('/users/:id/')

app.get('/api/studycards', auth.basicAuth(express), studyCard.getAll);
app.get('/api/studycards/:id', auth.basicAuth(express), studyCard.getOne)
app.put('/api/studycards', auth.basicAuth(express), studyCard.createNew);


app.get('/api/teachers', teacher.getAll);
app.get('/api/teachers/:id', teacher.getOne);

app.get('/api/class', classSubject.getALL);
app.get('/api/class/:id', classSubject.getOne);


// HTML Routes
app.post('/login', auth.login);
app.get('/logoff', auth.logoff);

app.get('/', function(req, res, next) {
    if (!req.session.userid) {
        console.log("Redirecting to login");
        res.redirect('/login.html'); // No userid? need to login
    } else {
        console.log("Redirecting to institute app");
        res.redirect('/users/' + req.session.userid); // send them to their studycard
    }
});

app.get('/users/:id', function(req, res, next) {
    if (!req.session.userid) {
        console.log("Redirecting to login");
        res.redirect('/login.html'); // No userid? need to login
    } else {
        console.log("Sending to institute app");
        console.log('Checking access:', req.params.id, req.session.userid);
        var isAuthorized = req.params.id == req.session.userid; // Check that userid matches what they are requesting
        if (!isAuthorized) res.send(403);  // Unauthorized
        res.sendfile('public/angular/instituteapp.html', { maxAge : 3600 }, null);
    }
});

app.get('/users/*', function(req, res, next) {
    if (!req.session.userid) {
        console.log("Redirecting to login");
        res.redirect('/login.html'); // No userid? need to login
    } else {
        console.log("Sending to institute app");
        res.sendfile('public/angular/instituteapp.html', { maxAge : 3600 }, null);
    }
});

app.get('/register.html', function(req, res, next) {
    console.log("Sending login");
    res.sendfile('public/login.html', { maxAge : 3600 }, null);
});

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
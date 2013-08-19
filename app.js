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
/*app.use(function(req, res, next){

    next();
});
*/

app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'NEPHIISCOOL', key: 'inst.sess'}));

// logger
app.use(function(req, res, next) {
    //console.log("sess: " + JSON.stringify(req.session));
    if (req.url == "/favicon.ico") { next(); return; }
    console.log(req.method +" "+ req.path + " " + JSON.stringify(req.query));
    next();
});


// RESTful API Routes
app.get('/api/users', auth.basicAuth(express), user.getAll);
app.get('/api/users/:id', auth.basicAuth(express), user.getOne);
app.get('/api/users/:id/studycards', auth.basicAuth(express), user.getUserStudyCards);
app.put('/api/users', auth.basicAuth(express), user.createNew);
app.del('/api/users/:id', auth.basicAuth(express), user.remove);

app.get('/api/studycards', auth.basicAuth(express), studyCard.getAll);
app.get('/api/studycards/:id', auth.basicAuth(express), studyCard.getOne)
app.put('/api/studycards', auth.basicAuth(express), studyCard.createNew);
app.del('api/studycards/:id', auth.basicAuth(express), studyCard.remove);

app.get('/api/teachers', teacher.getAll);
app.get('/api/teachers/:id', teacher.getOne);
app.get('/api/teachers/:id/classes', teacher.getClasses);
app.put('/api/teachers', auth.basicAuth(express), teacher.createNew);
app.del('/api/teachers/:id', auth.basicAuth(express), teacher.remove);

app.get('/api/class', classSubject.getALL);
app.get('/api/class/:id', classSubject.getOne);
app.get('/api/class/:id/teachers', classSubject.getTeachers);
app.get('/api/class/:id/students', classSubject.getStudents);
app.put('/api/class', auth.basicAuth(express), classSubject.createNew);
app.del('/api/class/:id', auth.basicAuth(express), classSubject.remove);


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
        if (!isAuthorized)
            res.send(403);  // Unauthorized
        else
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

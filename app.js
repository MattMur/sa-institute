var express = require('express');
var path = require('path');
var app = express();

var auth = require('./scripts/authentication');
var user = require('./routes/user');
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

var UserAccess = 1;
var AdminAccess = 2;

// RESTful API Routes
// (\\d+) --Match any number
app.get('/api/users', auth.basicAuth(express, 2), user.getAll);
app.get('/api/users/:id(\\d+)', auth.basicAuth(express, 1), user.getOne);
app.get('/api/users/:id(\\d+)/studycards', auth.basicAuth(express, 1), user.getUserStudyCards);
app.post('/api/users', user.createNew); // No auth needed to create new user
app.put('/api/users/:id(\\d+)', auth.basicAuth(express, 1), user.modify);
app.del('/api/users/:id(\\d+)', auth.basicAuth(express, 2), user.remove);

app.get('/api/studycards', auth.basicAuth(express, 1), studyCard.getAll);
app.get('/api/studycards/:id(\\d+)', auth.basicAuth(express, 1), studyCard.getOne)
app.post('/api/studycards', auth.basicAuth(express, 1), studyCard.createNew);
app.del('/api/studycards/:id(\\d+)', auth.basicAuth(express, 1), studyCard.remove);
app.get('/api/studycards/notes', auth.basicAuth(express, 2), studyCard.getNotes);

app.get('/api/teachers', auth.basicAuth(express, 1), teacher.getAll);
app.get('/api/teachers/:id(\\d+)', auth.basicAuth(express, 1), teacher.getOne);
app.get('/api/teachers/:id(\\d+)/classes', auth.basicAuth(express, 1), teacher.getClasses);
app.post('/api/teachers', auth.basicAuth(express, 2), teacher.createNew);
app.del('/api/teachers/:id(\\d+)', auth.basicAuth(express, 2), teacher.remove);

app.get('/api/class', auth.basicAuth(express, 1), classSubject.getALL);
app.get('/api/class/:id(\\d+)', auth.basicAuth(express, 1), classSubject.getOne);
app.get('/api/class/:id(\\d+)/teachers', auth.basicAuth(express, 1), classSubject.getTeachers);
app.get('/api/class/:id(\\d+)/students', auth.basicAuth(express, 1), classSubject.getStudents);
app.post('/api/class', auth.basicAuth(express, 2), classSubject.createNew);
app.put('/api/class/:id(\\d+)', auth.basicAuth(express, 2), classSubject.modify);
app.del('/api/class/:id(\\d+)', auth.basicAuth(express, 2), classSubject.remove);




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


// Route for any User path
app.get(/^\/users(?:\/)?([0-9]*)?/, function(req, res, next) {
    if (!req.session.userid) {
        console.log("Redirecting to login");
        res.redirect('/login.html'); // No userid? need to login
    } else {
        console.log('Sending to User Index');
        var paramId = req.params[0];
        console.log('Checking access:', paramId, req.session.userid);
        var isAuthorized = paramId == req.session.userid; // Check that userid matches what they are requesting
        if (!isAuthorized) {
            console.log('Access denied');
            res.send(403);  // Unauthorized
        }
        else {
            res.sendfile('public/angular/instituteapp.html', { maxAge : 3600 }, null);
        }

    }
});

// Route to any Admin path.
app.get(/^\/admin/, function(req, res, next) {
    if (!req.session.userid) {
        console.log("Redirecting to login");
        res.redirect('/login.html'); // No userid? need to login
    } else {
        // check that user has required access
        console.log('Sending to Admin');
        console.log('Current access_level: '+ req.session.access_level);
        if (req.session.access_level < AdminAccess) {
            res.status(403).send('HTTP 403 - user does not have required permissions'); // Not high enough access_level. Forbidden!!
        } else {
            res.sendfile('public/angular/instituteapp.html', { maxAge : 3600 }, null);
        }
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

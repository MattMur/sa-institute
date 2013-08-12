var express = require('express');
var path = require('path');
var app = express();

var authHandler = require('./basicAuth');
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
    console.log("req: " + JSON.stringify([req.method, req.path, req.user, req.session]));
    next();
});


// API Routes
app.get('/api/users', authHandler(express), user.getAll);
app.get('/api/users/:id', authHandler(express), user.getOne);
//app.get('/users/:id/studycards', user.getUserStudyCards);
//app.get('/users/:id/')

app.get('/api/studycards', authHandler(express), studyCard.getAll);
app.get('/api/studycards/:id', authHandler(express), studyCard.getOne)
app.put('/api/studycards', authHandler(express), studyCard.put);


app.get('/api/teachers', teacher.getAll);
app.get('/api/teachers/:id', teacher.getOne);

app.get('/api/class', classSubject.getALL);
app.get('/api/class/:id', classSubject.getOne);


// HTML Routes
app.get('/', function(req, res, next) {
    if (!req.session.userid) {
        res.redirect('/login.html'); // No userid? need to login
    } else {
        res.redirect('/users/' + req.session.userid + '/studycard'); // send them to their studycard
    }
});

app.post('/login', authHandler(express), function(req, res) {
    // They should have sent http basic auth headers and should now have session cookie
    console.log('Should be good to go! User: ' + req.session.userid);
    res.status(200).send(req.session.userid.toString());
});

app.get('/users/:id/studycard', function(req, res, next) {
    if (!req.session.userid) {
        res.redirect('/login.html'); // No userid? need to login
    } else {
        console.log('Checking access:', req.params.id, req.session.userid);
        var isAuthorized = req.params.id == req.session.userid; // Check that userid matches what they are requesting
        if (!isAuthorized) res.send(403);  // Unauthorized
        res.sendfile('public/users/studycard.html', { maxAge : 3600 }, null);
    }
});

app.get('/logoff', function(req, res, next) {
    req.session = null;
    res.redirect('/login.html');
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
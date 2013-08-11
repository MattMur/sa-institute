var express = require('express');
var path = require('path');
var app = express();

var authHandler = require('./basicAuth');
var user = require('./routes/users');
var teacher = require('./routes/teachers');
var classSubject = require('./routes/class');
var studyCard = require('./routes/studyCards');


//filter
app.use(function(req, res, next){
    if (req.url == "/favicon.ico") return;
    next();
});

console.log("server started");


//app.use(express.logger());
app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'NEPHIISCOOL'}));

// logger
app.use(function(req, res, next) {
    //console.log("sess: " + JSON.stringify(req.session));
    console.log("req: " + JSON.stringify([req.method, req.path, req.user, req.session]));
    next();
});

// Routes
app.post('/login', authHandler(express), function(req, res) {
    console.log('Should be good to go!')
    res.send(200);
});

app.get('/users', authHandler(express), user.getAll);
app.get('/users/:id', authHandler(express), user.getOne);
//app.get('/users/:name', user.getName);

app.get('/studycards', authHandler(express), studyCard.getAll);
app.get('/studycards/:id', authHandler(express), studyCard.getOne)
app.put('/studycards', authHandler(express), studyCard.put);


app.get('/teachers', teacher.getAll);
app.get('/teachers/:id', teacher.getOne);

app.get('/class', classSubject.getALL);
app.get('/class/:id', classSubject.getOne);

app.get('/studycard.html', authHandler(express), function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.sendfile('public/studycard.html', { maxAge : 3600 }, null);
    }

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
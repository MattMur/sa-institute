/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 1:20 PM
 * To change this template use File | Settings | File Templates.
 */
var path = require('path');


// create routes
var routes = {};
routes["users"] = user.handle;
routes["teachers"] = teacher.handle;
routes["class"] = classSubject.handle;
routes["studycards"] = studyCard.handle;
console.log("This only happens the first time");

function route(app) {

    console.log("App Path: " + app.path());
    //console.log("filepath: " +__filename);



    /*var urlParts = request.path.split(path.sep);
    var baseUrl = urlParts[1];
    console.log("firstUrlPart: "+baseUrl);
    // Check that function exists for the pathname
    if (typeof routes[baseUrl] === 'function') {
        routes[baseUrl](request, response, next);
    } else {
        // Update to do Express error handling
        next();
    }*/

}

exports.route = route;
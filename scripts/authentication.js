/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/9/13
 * Time: 9:42 PM
 *
 */

var sql = require('./sqlconn');

exports.login = function (req, res, next) {
    login(req.body.user, req.body.pass, function(isAuthorized, user) {
        // Set the session now that we have authenticated
        if (isAuthorized)
        {
            // Session cookie needed to keep state between service calls
            // so that user doesnt have to login every time
            console.log('Session cookie has been set');
            console.log('Should be good to go! \nUser: ' + user.id);
            console.log('access_level: '+ user.access_level);
            req.session.userid = user.id;
            req.session.access_level = user.access_level;

            var responseObj = {id : user.id}; // Send the user id as the response
            res.status(200).send(responseObj);
        } else {
            res.send(401); // Not authorized
        }

    });
};

exports.logoff = function(req, res, next) {
    req.session = null;
    res.redirect('/login.html');
};

// Exports the Basic Authentication Middleware
// When authenticated, populate the session cookie with user
exports.basicAuth = function(express, requiredaccess_level) {
  return function (req, res, next)
  {
      // if we don't have a session, then run basic auth middleware
      if (!req.session.userid)
      {
          console.log('Auth requested but no session detected. Performing basic auth.');
          var performAuth = express.basicAuth(function (user, password, callback)
          {
              // Login since they don't have a session id
                login(user, password, function(isAuthorized) {
                    if (isAuthorized)
                    {
                        console.log('Session cookie has been set');
                        req.session.userid = user.id;
                        req.session.access_level = user.access_level;

                        // check that user has required access
                        if (user.access_level < requiredaccess_level) {
                            res.status(403).send('HTTP 403 user does not have required permissions'); // Not high enough access_level. Forbidden!!
                           return;
                        }
                    }
                    callback(null, isAuthorized);
                });


          });
          performAuth(req, res, next);

      } else if (req.session.access_level < requiredaccess_level) {  // check that user has required access
          res.status(403).send('HTTP 403 user does not have required permissions'); // Not high enough access_level. Forbidden!!
      } else {
          next(); // We do have a session, so nothing to worry about
      }
  }
};


function login(email, password, callback) {
    // get email and password and make sure they both match
    sql.query('SELECT id, email, password, access_level FROM user WHERE email = ?', [email], function(err, rows)
    {

        if (err)
        {
            console.log(err);
            callback(err, false);
        } else
        {
            // Check if we got a match back from database
            var isAuthorized = false;
            var user = null;
            if (rows.length > 0)
            {
                var user = rows[0];
                isAuthorized = (user.password == password);  // Does password match?
                console.log('User?: \n', JSON.stringify(rows));
                console.log('Password received?: ', password);
                console.log("Authorized?: ", isAuthorized);
            }
            callback(isAuthorized, user);

        }
    });
}



//module.exports.checkSession = function (req, res, next) {
//    console.log('Checking access:', req.params.id, req.session.userid);
//    var isAuthorized = req.params.id == req.session.userid;
//    if(!isAuthorized) {
//        res.send(403); //
//    }
//};



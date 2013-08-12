/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/9/13
 * Time: 9:42 PM
 *
 */

var sql = require('./sqlconn');

// Exports the Basic Authentication Middleware
// When authenticated, populate the session cookie with user
module.exports = function(express) {
  return function (req, res, next)
  {

      // if we don't have a session, then run basic auth middleware
      // If we do have a session, then nothing to worry about
      if (!req.session.userid)
      {
          console.log('Auth requested but no session detected. Performing basic auth.');
          var performAuth = express.basicAuth(function (user, password, callback)
          {

              // get email and password and make sure they both match
              sql.query('SELECT id, email, password FROM students WHERE email = ?', [user], function(err, rows)
              {

                  if (err)
                  {
                      console.log(err);
                      callback(err, false);
                  } else
                  {
                      // Check if we got a match back from database
                      var isAuthorized = false;
                      if (rows.length > 0)
                      {
                            isAuthorized = (rows[0].password == password);  // Does password match?
                            console.log('User?: \n', JSON.stringify(rows));
                            console.log('Password received?: ', password);

                          //check if user has access to requested resource
//                          if (isAuthorized && req.params.id) {
//                              console.log('Checking access:', req.params.id, rows[0].id);
//                              isAuthorized = req.params.id == rows[0].id;
//                          }

                            console.log("Authorized?: ", isAuthorized);

                            // Set the session now that we have authenticated
                            if (isAuthorized)
                            {
                                console.log('Session cookie has been set');
                                req.session.userid = rows[0].id;
                                //req.session.user = user;
                            }

                      }

                      callback(null, isAuthorized);

                  }

              });
          });

          performAuth(req, res, next);

      } else {
          next();
      }
  }
};

//module.exports.checkSession = function (req, res, next) {
//    console.log('Checking access:', req.params.id, req.session.userid);
//    var isAuthorized = req.params.id == req.session.userid;
//    if(!isAuthorized) {
//        res.send(403); //
//    }
//};



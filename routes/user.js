var sql = require('../scripts/sqlconn');
var squel = require("squel");

exports.getAll = function(req, res, next) {
    sql.query('SELECT id, first_name, last_name, email, phone, access_level FROM user ORDER BY last_name', function(err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log('users are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.getOne = function(req, res, next) {

    // We do have session, however we need to check if user has access to requested resource
    // check that the user_id is the same as the requested user_id
    console.log('Checking access2: '+ req.params.id +' '+ req.session.userid);
    var isAuthorized = (req.session.access_level == 2) || (req.params.id == req.session.userid);

    if (isAuthorized) {

        var queryStr = 'SELECT id, first_name, last_name, email, phone, access_level FROM user WHERE id = ?';

        sql.query(queryStr, req.params.id, function(err, rows) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                var response = rows.length == 1 ? rows[0] : {};
                res.json(response);
            }
        });
    } else {
        console.log('Access denied for request');
        res.send(403); // Send 403 if user ids do not match
    }
};

exports.getCurrentClass = function(req, res, next) {
    console.log('Checking access3:', req.params.id, req.session.userid);
    var isAuthorized = (req.session.access_level == 2) || (req.params.id == req.session.userid);

    if (isAuthorized) {

        var queryStr = 'SELECT * FROM class ' + 
        'LEFT JOIN user_enrolled_in_class ON class.id = user_enrolled_in_class.class_id ' +
        'LEFT JOIN user ON user.id = user_enrolled_in_class.user_id WHERE user.id = ? ' +
        'ORDER BY user_enrolled_in_class.enrolled_date DESC ' +
        'LIMIT 1;';

        sql.query(queryStr, req.params.id, function(err, rows) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                var response = rows.length == 1 ? rows[0] : {};
                res.json(response);
            }
        });
    } else {
        console.log('Access denied for request');
        res.send(403); 
    }
};

exports.getUserClasses = function(req, res, next) {
    console.log('Checking access4:', req.params.id, req.session.userid);
    var isAuthorized = (req.session.access_level == 2) || (req.params.id == req.session.userid);

    if (isAuthorized) {

        var injects = [req.params.id];
        var query = squel.select().field('class.*').from('class')
            .join('user_enrolled_in_class', 'uc', 'class.id = uc.class_id')
            .where('uc.user_id = ?')
            .order('uc.enrolled_date', false); // false=DESC

        if (req.query.date) {  // Filter by classes that were active during the date given
            query = query.where('? BETWEEN class.start_date AND class.end_date');  //filter += req.query.date ? ' WHERE ? BETWEEN class.startdate AND class.enddate' : "";
            injects.push(req.query.date);
        } //DATE_FORMAT(NOW(),'%m-%d-%Y')
        if (req.query.limit) { // Limit to specific number of results
            var limit = parseInt(req.query.limit);
            query = query.limit(limit);
        }

        console.log('Get user classes query: ' + query.toString());
        console.log('Injects: '+injects);

        sql.query(query.toString(), injects, function(err, rows) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json(rows);
            }
        });
    } else {
        console.log('Access denied for request');
        res.send(403);
    }
};



// Get all the studycards that belong to the user
exports.getUserStudyCards = function(req, res, next) {

    console.log('Getting users study cards');
    var isAuthorized = req.params.id == req.session.userid;
    if (isAuthorized) {

        var queryStr = 'SELECT sc.* FROM study_card sc WHERE sc.user_id = ? ORDER BY sc.week_number';
        sql.query(queryStr, req.params.id, function(err, rows) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                console.log('studycards are: \n', JSON.stringify(rows));
                res.json(rows);
            }
        });
    } else {
        console.log('Access denied for request');
        res.send(403); // Send 403 if user ids do not match
    }
}

exports.createNew = function(req, res, next) {

    // Check that user doesn't already exist
    console.log('Checking if user already exists...');
    sql.query('SELECT email FROM user WHERE email = ?', req.body.email, function(err, result) {
         if (err) {
             console.log(err);
         } else {
             if (result.length == 0) { // User does not exist

                 // Add default access level to user
                 req.body.access_level = 1;
                 console.log('Adding new user: '+ JSON.stringify(req.body));
                 sql.query('INSERT INTO user SET ?', req.body, function(err, result) {
                     if (err) {
                         console.log(err);
                         res.status(500).send(err);
                     } else {
                         req.session.userid = result.insertId;  // Change session id to newly created user
                         console.log(' added new User', result.insertId);
                         res.send(result.insertId.toString());  // Send back user id they they know who they are
                     }
                 });
             } else {
                 res.status(409).send('User already exists.');
             }
         }
    });


}

// READ UP ON CASCADING DELETES
exports.remove  = function(req, res, next) {

        console.log('Deleting user..');
        sql.query('DELETE FROM user WHERE user.id = ?', req.params.id, function(err, result) {
            if (err) {
                console.log("mysql err: " + err);
                res.status(500).send(err);
            } else {
                console.log('Removed user');
                res.send(200);
            }
        });

}

exports.modify  = function(req, res, next) {
    delete req.body.id; // We don't want to allow modification of id

    // Either you are admin, or you are the user you want to modify
    var isAuthorized = (req.session.access_level == 2) || (req.params.id == req.session.userid);
    if (isAuthorized) {
        sql.query('UPDATE user SET ? WHERE user.id = ?', [req.body,  req.params.id], function(err, result) {
            if (err) {
                console.log("mysql err: " + err);
                res.status(500).send(err);
            } else {
                console.log('Modified user');
                res.send(200);
            }
        });
    } else {
        console.log('Access denied for request');
        res.send(403);
    }

}
var sql = require('../scripts/sqlconn');

exports.getAll = function(req, res, next) {

    sql.query('SELECT id, firstname, lastname, email, phone, class_id, accesslvl FROM students ORDER BY lastname', function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('users are: \n', JSON.stringify(rows));
            res.json(rows);
        }

    });

};

exports.getOne = function(req, res, next) {

    // We do have session, however we need to check if user has access to requested resource
    // check that the user_id is the same as the requested user_id
    console.log('Checking access:', req.params.id, req.session.userid);
    var isAuthorized = (req.session.accesslvl == 2) || (req.params.id == req.session.userid);

    if (isAuthorized) {

        var queryStr = 'SELECT id, firstname, lastname, email, phone, class_id, accesslvl FROM students WHERE id = ?';

        sql.query(queryStr, req.params.id, function(err, rows) {
            if (err) {
                console.log(err);
                res.send(500);
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

// Get all the studycards that belong to the user
exports.getUserStudyCards = function(req, res, next) {

    console.log('Getting users study cards');
    var isAuthorized = req.params.id == req.session.userid;
    if (isAuthorized) {

        var queryStr = 'SELECT sc.* FROM studycard sc WHERE sc.students_id = ? ORDER BY sc.weekNum';
        sql.query(queryStr, req.params.id, function(err, rows) {
            if (err) {
                console.log(err);
                res.send(500);
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

    // Add default access level to user
    req.body.accesslvl = 1;
    console.log(JSON.stringify(req.body));
    sql.query('INSERT INTO students SET ?', req.body, function(err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            req.session.userid = result.insertId;  // Change session id to newly created user
            console.log(' added new User', result.insertId);
            res.send(result.insertId.toString());  // Send back user id they they know who they are
        }
    });
}

// READ UP ON CASCADING DELETES
exports.remove  = function(req, res, next) {

        sql.query('DELETE FROM students WHERE students.id = ?', req.params.id, function(err, result) {
            if (err) {
                console.log("mysql err: " + err);
                res.send(500);
            } else {
                console.log('Removed user');
                res.send(200);
            }
        });

}

exports.modify  = function(req, res, next) {
    delete req.body.id; // We don't want to allow modification of id

    // Either you are admin, or you are the user you want to modify
    var isAuthorized = (req.session.accesslvl == 2) || (req.params.id == req.session.userid);
    if (isAuthorized) {
        sql.query('UPDATE students SET ? WHERE students.id = ?', [req.body,  req.params.id], function(err, result) {
            if (err) {
                console.log("mysql err: " + err);
                res.send(500);
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
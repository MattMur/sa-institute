var sql = require('../scripts/sqlconn');

exports.getAll = function(req, res, next) {

    sql.query('SELECT * FROM students', function(err, rows) {
        if (err) {
            console.log(err);
            next(err);
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
    var isAuthorized = req.params.id == req.session.userid;

    if (isAuthorized) {
        sql.query('SELECT firstname, lastname, email, phone FROM students WHERE id = ?', req.params.id, function(err, rows) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                if (rows.length > 0) {
                    console.log('users are: \n', JSON.stringify(rows));
                    res.json(rows[0]);
                }
            }
        });
    } else {
        res.send(403); // Send 403 if user ids do not match
    }
};

exports.createNew = function(req, res, next) {
    console.log(JSON.stringify(req.body));
    sql.query('INSERT INTO students SET ?', req.body, function(err, result) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            req.session.userid = result.insertId;  // Change session id to newly created user
            console.log(' added new User', result.insertId);
            res.send(result.insertId.toString());
        }
    });
}
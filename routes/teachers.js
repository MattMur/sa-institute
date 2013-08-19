/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../scripts/sqlconn');

exports.getAll = function(req, res, next) {

    sql.query('SELECT * FROM teachers', function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('teachers are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.getOne = function(req, res, next) {

    sql.query('SELECT * FROM teachers WHERE id = ?', req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('teachers are: \n', JSON.stringify(rows));
            var response = rows.length == 1 ? rows[0] : {};
            res.json(response);
        }
    });
};

exports.getClasses = function(req, res, next) {

    var queryStr = 'SELECT c.* FROM class c JOIN class_has_teachers cht ON c.id = cht.class_id WHERE cht.teachers_id = ?';

    sql.query(queryStr, req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('classes for teacher are are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.createNew = function(req, res, next) {
    console.log("Teacher json: " + JSON.stringify(req.body));

    if (req.body) {
        sql.query('INSERT INTO teachers SET ?', req.body, function(err, result) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.status(200).send(result.insertId.toString());
            }
        });
    }
}

exports.remove = function(req, res, next) {

    sql.query('DELETE FROM teachers WHERE id = ?', req.params.id, function(err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('Removed teacher');
            res.send(200);
        }
    });
}
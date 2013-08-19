/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../scripts/sqlconn');

exports.getALL = function(req, res, next) {

    sql.query('SELECT * FROM class', function(err, rows) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('classes are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });

};

exports.getOne = function(req, res, next) {

    sql.query('SELECT * FROM class WHERE id = ?', req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('classes are: \n', JSON.stringify(rows));
            var response = rows.length == 1 ? rows[0] : {};
            res.json(response);
        }
    });

};

exports.getTeachers = function(req, res, next) {

    var queryStr = 'SELECT t.* FROM teachers t JOIN class_has_teachers cht ON t.id = cht.teachers_id WHERE cht.class_id = ?';

    sql.query(queryStr, req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('teachers for class are are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.getStudents = function(req, res, next) {

    var queryStr = 'SELECT * FROM students WHERE class_id = ?';

    sql.query(queryStr, req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('teachers for class are are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.createNew = function(req, res, next) {
    console.log(JSON.stringify(req.body));
    sql.query('INSERT INTO class SET ?', req.body, function(err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('Added new class', result.insertId);
            res.send(result.insertId.toString());  // Send back class id
        }
    });
}

exports.remove  = function(req, res, next) {

    sql.query('DELETE FROM class WHERE class.id = ?', req.params.id, function(err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('Removed user');
            res.send(200);  // Send back user id they they know who they are
        }
    });
}
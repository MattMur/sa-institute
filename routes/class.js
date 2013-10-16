/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../scripts/sqlconn');
var squel = require("squel");

exports.getALL = function(req, res) {

    var injects = [];
    var query = squel.select().from('class'); // var queryStr = 'SELECT * FROM class';

    if (req.query.date) {  // Filter by classes that were active during the date given
        query = query.where('? BETWEEN class.startdate AND class.enddate');  //filter += req.query.date ? ' WHERE ? BETWEEN class.startdate AND class.enddate' : "";
        injects.push(req.query.date);
    }
    if (req.query.name) {  // Filter by name of class
        query = query.where('name = ?');  //filter += ' WHERE name = ?';
        injects.push(req.query.name);
    } //DATE_FORMAT(NOW(),'%m-%d-%Y')
    console.log('Get classes query: ' + query.toString());

    sql.query(query.toString(), injects, function(err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send('Could not get classes');
        } else {
            console.log('classes are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });

};

exports.getOne = function(req, res, next) {

    //DATE_FORMAT(NOW(),'%m-%d-%Y')
    sql.query('SELECT * FROM class WHERE id = ?', req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send('Could not get class');
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
            res.status(500).send('Could not get teachers');
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
            res.status(500).send('Could not get students');
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
            res.status(500).send('Could not create new class');
        } else {
            console.log('Added new class', result.insertId);
            res.send(result.insertId.toString());  // Send back class id
        }
    });
}

exports.modify = function(req, res, next) {

    if (req.body) {
        // Remove id from update, if exists in body. Don't allow changing id.
        if (req.body.id) {
            delete req.body.id;
        }
        console.log('Modifying class' + req.params.id + ': '+ JSON.stringify(req.body));
        var queryStr = 'UPDATE class SET ? WHERE id = ?';
        sql.query(queryStr, [req.body, req.params.id], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send('Modify class failed');
            } else {
                console.log('Modified class succesfully');
                res.send(200);  // Send back user id they they know who they are
            }
        });
    }
}

exports.remove  = function(req, res, next) {

    sql.query('DELETE FROM class WHERE class.id = ?', req.params.id, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Could not delete class');
        } else {
            console.log('Removed class');
            res.send(200);  // Send back user id they they know who they are
        }
    });
}
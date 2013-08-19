/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../scripts/sqlconn');


exports.getAll = function(req, res, next) {
    //console.log('Params:' + JSON.stringify(req));
    sql.query('SELECT * FROM studyCard', function(err, rows, features) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('studyCards are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.getOne = function(req, res, next) {
    sql.query('SELECT * FROM studyCard WHERE id = ?', req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('studyCards are: \n', JSON.stringify(rows));
            var response = rows.length == 1 ? rows[0] : {};
            res.json(response);
        }
    });
};



exports.createNew = function(req, res, next) {

    console.log("Studycard json: " + JSON.stringify(req.body));
    //{"class_id":"1","frequency":"3","quality":"4","block":"","thoughts":" "}
    if (req.body) {
        sql.query('INSERT INTO studyCard SET ?', req.body, function(err, result) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                //console.log('studyCards are: \n', JSON.stringify(rows));
                res.status(200).send(result.insertId.toString());
            }
        });
    }

}

exports.remove = function(req, res, next) {

    sql.query('DELETE FROM studyCard WHERE id = ?', req.params.id, function(err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('Removed user');
            res.send(200);
        }
    });
}
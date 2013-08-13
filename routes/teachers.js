/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../scripts/sqlconn');

exports.getAll = function(req, res, next) {

    sql.query('SELECT * FROM teachers', function(err, rows, features) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('teachers are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.getOne = function(req, res, next) {

    sql.query('SELECT * FROM teachers WHERE id = ?', req.params.id, function(err, rows, features) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('teachers are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });


};
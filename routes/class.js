/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */

exports.handle = function(req, res, next){
    var sql = require('../sqlconn');


    sql.perform('SELECT * FROM class', function(err, rows, features) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('classes are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });


};
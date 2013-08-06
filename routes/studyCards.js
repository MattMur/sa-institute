/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../sqlconn');


exports.getAll = function(req, res, next) {

    console.log("Did I get this far?");
    sql.query('SELECT * FROM studyCard', function(err, rows, features) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('studyCards are: \n', JSON.stringify(rows));
            res.json(rows);
        }
    });
};

exports.post = function(req, res, next) {
    console.log(req.method);
    res.setHeader('Content-Type','text/html');
    res.send("<p>Thank you for your submission</p><br>" + JSON.stringify(req.body) + "<br>");
}
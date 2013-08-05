/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */


exports.handle = function(req, res, next){
    var sql = require('../sqlconn');

    if (req.method == "GET") {
        sql.query('SELECT * FROM studyCard', function(err, rows, features) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log('studyCards are: \n', JSON.stringify(rows));
                res.json(rows);
            }
        });

    } else if (req.method == "POST") {
        console.log(req.method);
        res.setHeader('Content-Type','text/html');
        res.send("<p>Thank you for your submission</p><br>" + JSON.stringify(req.body) + "<br>");
    }

};
var sql = require('../sqlconn');

exports.getAll = function(req, res, next) {

    sql.query('SELECT * FROM students', function(err, rows, features) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('users are: \n', JSON.stringify(rows));
            res.json(rows);
        }

    });

};
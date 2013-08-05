


exports.handle = function(req, res, next){


    sql.perform('SELECT * FROM students', function(err, rows, features) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('users are: \n', JSON.stringify(rows));
            res.json(rows);
        }
        //sql.end();
    });



};
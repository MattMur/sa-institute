/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../scripts/sqlconn');
var squel = require('squel');
require('../public/js/lib/date');

exports.getAll = function(req, res, next) {

    var isAuthorized = true;  // We will decide if they are authorized based on what is requested
    var injects = [];  // array of parameters injected into query
    var query = squel.select().from('studyCard'); // squel object is used to flexibly build SQL statement

    // Filter by id or class name
    if (req.query.classid) {
        query = query.where('class_id=?')
        injects.push(req.query.classid);
    } else if (req.query.classname) {
        // find the classid based on class name
        query = query.where('class_id is null or class_id=(SELECT class.id FROM class WHERE class.name is null or class.name = ?)');
        injects.push(req.query.classname);
    }

    // Filter by user id
    if (req.query.user) {
        isAuthorized = req.session.userid == req.query.user; //You can't get cards for someone other than yourself
        query = query.where('students_id=?');
        injects.push(req.query.user);
    } else { // you don't have userid so request is for ALL studycards. We need to verify admin access for that.
        if (req.session.accesslvl != 2) {
            // If request doesn't have admin then we just get studycards matching their session userid
            query = query.where('students_id=?');
            injects.push(req.session.userid);
        }
    }

    // Start and and date range filter
    if (req.query.startdate && req.query.enddate) {
        query = query.where('studyCard.date BETWEEN ? AND ?');
        injects.push(req.query.startdate, req.query.enddate);
    } else if (req.query.enddate) {
        query = query.where('studyCard.date=?');
        injects.push(req.query.enddate);
    }
    query = query.order('weekNum');

    console.log('StudyCard query: ' + query);
    console.log('inject: ' + JSON.stringify(injects));

    if (isAuthorized) {
        sql.query(query.toString(), injects, function(err, rows, features) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                console.log('studyCards are: \n', JSON.stringify(rows));
                res.json(rows);
            }
        });

    } else {
        res.send(403); // Send 403 if user ids do not match
    }


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
    //{"class_id":"1","frequency":"3","quality":"4","block":"","thoughts":" "}
    if (req.body) {

        //Find the current weekNum. Get startdate from the class they selected
        sql.query('SELECT startdate FROM class WHERE id=? LIMIT 1', req.body.class_id, function(err, result) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {

                // Calculate difference in weeks to get current week number
                var startdate = new Date(result[0].startdate);
                var weekNum = (Date.today().getWeek() - startdate.getWeek()) + 1;
                req.body.weekNum = weekNum; // Add one to get current week
                console.log('Current Week: ' + JSON.stringify(req.body.weekNum));
                console.log("Studycard json: " + JSON.stringify(req.body));

                // Insert new card into database
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
        });
    }
}

exports.remove = function(req, res, next) {

    sql.query('DELETE FROM studyCard WHERE id = ?', req.params.id, function(err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('Removed studycard');
            res.send(200);
        }
    });
}
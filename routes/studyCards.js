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

    var isAuthorized, injects = [];  // array of parameters injected into query
    var query = squel.select().from('study_card'); // squel object is used to flexibly build SQL statement
    query = filterByParams(req, query, injects);
    isAuthorized = checkIsAuthorized(req, query, injects);
    query = query.order('week_number');

    console.log('StudyCard query: ' + query);
    console.log('inject: ' + JSON.stringify(injects));

    if (isAuthorized) {
        sql.query(query.toString(), injects, function(err, rows, features) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                //console.log('studyCards are: \n', JSON.stringify(rows));

                // This could be a big payload so lets allow caching. 15min caching limit.
                //res.set('Cache-Control', 'max-age=900, private, must-revalidate');
                res.json(rows);
            }
        });
    } else {
        res.send(403); // Send 403 if user ids do not match
    }


};

exports.getOne = function(req, res) {
    sql.query('SELECT * FROM study_card WHERE id = ?', req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('studyCards are: \n', JSON.stringify(rows));
            var response = rows.length == 1 ? rows[0] : {};
            res.set('Cache-Control', 'max-age=900, private, must-revalidate');
            res.json(response);
        }
    });
};


// Create a new Studycard ALSO enroll user for class if not already
exports.createNew = function(req, res) {
    //{"class_id":"1","frequency":"3","quality":"4","block":"","thoughts":" "}
    if (req.body) {

        //Find the current week_number. Get startdate from the class they selected
        sql.query('SELECT start_date FROM class WHERE id=? LIMIT 1', req.body.class_id, function(err, result) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {

                // Calculate difference in weeks to get current week number
                var startdate = new Date(result[0].startdate);
                var week_number = (Date.today().getWeek() - startdate.getWeek()) + 1;
                var created_date = Date.today();
                req.body.week_number = week_number; // Add one to get current week
                req.body.created_date = created_date;
                //console.log('Current Week: ' + JSON.stringify(req.body.week_number));
                //console.log("Studycard json: " + JSON.stringify(req.body));

                // Insert new card into database
                sql.query('INSERT INTO study_card SET ?', req.body, function(err, result) {
                    if (err) {
                        console.log(err);
                        res.send(500);
                    } else {
                        //console.log('studyCards are: \n', JSON.stringify(rows));
                        res.status(200).send(result.insertId.toString());
                    }
                });

                // Enroll user to class they selected if not already enrolled
                var enrollQuery = "SELECT * FROM user_enrolled_in_class WHERE user_id = ? AND class_id = ?";
                sql.query(enrollQuery, [req.session.userid,  req.body.class_id], function(err, result) {
                    if (err) {
                        console.log(err);
                        res.send(500);
                    } else {
                        if (result.length == 0) {
                            // User is not enrolled. Enroll them!
                            var enrollObj = { class_id : req.body.class_id, user_id : req.session.userid };
                            sql.query('INSERT INTO user_enrolled_in_class SET ?', enrollObj, function(err, result) {
                                if (err) {
                                    console.log('Could not enroll user in class:\n'+err);
                                } else {
                                    console.log('User successfully enrolled in class: '+req.body.class_id);
                                }
                            });
                        } else {
                            console.log('User already enrolled in class');
                            // User is already enrolled. We're done here.
                        }

                    }
                });
            }
        });
    }
}

exports.remove = function(req, res) {

    sql.query('DELETE FROM study_card WHERE id = ?', req.params.id, function(err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('Removed studycard');
            res.send(200);
        }
    });
}

// Get all NOTES from all study cards. Then filter by query parameters.
exports.getNotes = function(req, res) {
    var query = squel.select().field('id').field('notes').field('week_number').from('study_card').where('notes IS NOT NULL');
    var isAuthorized, injects = [];  // array of parameters injected into query

    query = filterByParams(req, query, injects);
    isAuthorized = checkIsAuthorized(req, query, injects);
    query = query.order('week_number');
    console.log('Comments query: ' + query.toString());

    if (isAuthorized) {
        sql.query(query.toString(), injects, function(err, rows, features) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                //console.log('Notes are: \n', JSON.stringify(rows));
                res.set('Cache-Control', 'max-age=900, private, must-revalidate');
                res.json(rows);
            }
        });
    } else {
        res.send(403);
    }
}

function filterByParams(req, query, injects) {

    // Filter with user id
    if (req.query.user) {
        query = query.where('user_id=?');
        injects.push(req.query.user);
    }
    // Filter by id or class name
    if (req.query.classid) {
        query = query.where('class_id=?');
        injects.push(req.query.classid);
    } else if (req.query.classname) {
        // find the classid based on class name
        query = query.where('class_id is null or class_id=(SELECT class.id FROM class WHERE class.name is null or class.name = ?)');
        injects.push(req.query.classname);
    }

    // Start and end date range filter
    if (req.query.startdate && req.query.enddate) {
        query = query.where('study_card.created_date BETWEEN ? AND ?');
        injects.push(req.query.startdate, req.query.enddate);
    } else if (req.query.enddate) {
        query = query.where('study_card.created_date=?');
        injects.push(req.query.enddate);
    }

    // Week filter
    if (req.query.weekrange) {
        var regex = /([0-9])(?:..([0-9]))?/; // Capture group - any num 0-9, then .., then another num 0-9, second group is optional(?)
        var match = regex.exec(req.query.weekrange);
        if (match.length > 1) { // index 0 is always the full match, next are capture groups
            var start = match[1];
            var end = match[2] || start;
            query = query.where('week_number BETWEEN '+start+' AND '+end);
        }
    }
    return query;
}

function checkIsAuthorized(req, query, injects) {
    // Find out if authorized to do this based on user id and access lvl
    var isAuthorized = true;
    if (req.query.user) {
        isAuthorized = req.session.userid == req.query.user; //You can't get cards for someone other than yourself
    } else { // you don't have userid so request is for ALL studycards. We need to verify admin access for that.
        if (!req.session) {
            isAuthorized = false;
        }
        else if (req.session.access_level < 2) {
            isAuthorized = false;  // User needs admin access to make this request
        }
    }
    return isAuthorized;
}
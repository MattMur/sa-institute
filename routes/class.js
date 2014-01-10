/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
var sql = require('../scripts/sqlconn');
var squel = require("squel");
var fs=require('fs');

// Config for Amazon S3 services
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./scripts/aws-config.json');
var s3 = new AWS.S3();

exports.getALL = function(req, res) {

    var injects = [];
    var query = squel.select().from('class'); // var queryStr = 'SELECT * FROM class';

    if (req.query.date) {  // Filter by classes that were active during the date given
        query = query.where('? BETWEEN class.start_date AND class.end_date');  //filter += req.query.date ? ' WHERE ? BETWEEN class.startdate AND class.enddate' : "";
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


exports.getStudents = function(req, res, next) {

    // Get all students that have enrolled in a class
    var query = squel.select().from('user')
        .join('user_enrolled_in_class', 'uc', 'user.id = uc.user_id')
        .where('uc.class_id = ?');
    console.log('Query: ' + query.toString());

    sql.query(query.toString(), req.params.id, function(err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send('Could not get students');
        } else {
            //console.log('students for class are are: \n', JSON.stringify(rows));
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
};

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
};

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
};


exports.uploadSyllabus = function(req, res) {
    console.log("Syllabus Received: " + JSON.stringify(req.files) +'\nData: '+JSON.stringify(req.body));

    // Make sure we have a file and it has a name
    if (req.files.syllabus && req.body.name) {
        var fileName = req.body.name;
        console.log('FileName: ' +fileName);

        // Upload file from given path
        var file = req.files.syllabus;
        fs.readFile(file.path, function(err, data) {

            if(err) {
                console.log(err)
                res.send(500);
            } else {
                // Pass on data to AWS for S3 storage
                s3.putObject({ Bucket:'UselessData141', Key:fileName ,ACL:"public-read", ContentType:file.type, Body:data},
                    function(s3err) {
                        if (s3err) {
                            console.log(s3err);
                            res.send(500);
                        } else {
                            console.log('Success');
                            res.send(200);
                        }
                    }
                );
            }
        });
    } else {
        res.status('406').send('Not enough data received');
    }
};

exports.getSyllabus = function(req, res) {
    // Get syllabus name for class
    var classId = req.params.id;
    sql.query('SELECT syllabus FROM class WHERE class.id = ?', classId, function(err, rows) {
       if (err) {
           res.status(500).send('Could not query syllabus');
       } else {
           console.log('Syllabus: '+JSON.stringify(rows));
           if (rows.length > 0) {
               var fileName = rows[0].syllabus;
               // Use the name to get the actual file from S3
               s3.getObject({ Bucket:'UselessData141', Key:fileName }, function(s3err, data) {
                    if (s3err) {
                        res.status(500).send('Could not retrieve from S3');
                    } else {
                        //console.log('s3data: '+JSON.stringify(data));
                        // Send the data to the client
                        res.set('Content-Disposition', 'filename:'+fileName);
                        res.set('Content-Type', data.ContentType);
                        res.set('Cache-Control', 'max-age=518400'); // Cache for 6 days
                        res.send(data.Body);
                    }
               });
           }
       }
    });
};

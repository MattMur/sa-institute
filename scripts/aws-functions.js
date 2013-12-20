/**
 * Created by mattmurray on 11/2/13.
 */

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./scripts/aws-config.json');
var s3 = new AWS.S3();


exports.test = function() {
    console.log('Attempting to retrieve buckets...');
    s3.listBuckets({}, function (err, data) {
        if (err) {
            console.log(err); // an error occurred
        } else {
            console.log('Buckets!: '+ JSON.stringify(data)); // successful response
        }
    });

    console.log('Attempting to load from bucket...');
    s3.getObject({ Bucket:'UselessData141', Key:'IMG_0662.JPG'}, function(err, data) {

        if (err) {
            console.log(err);
        } else {
            console.log('Data: ' + JSON.stringify(data));
        }
    });
};

exports.uploadObject = function(req, res) {
    console.log("Uploading object: " + req.body);
    s3.putObject({ Bucket:'UselessData141', Key:"NewFile.jpg" ,ACL:"public-read", Body:req.body}, function(err) {
       if (err) {
           console.log(err);
       } else {
           console.log('Success');
       }
    });
};
/**
 * Created by mattmurray on 11/2/13.
 */

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./scripts/aws-config.json');
var s3 = new AWS.S3();


exports.buckets = function() {
    console.log('Attempting to retrieve buckets...');
    s3.listBuckets({}, function (err, data) {
        if (err) {
            console.log(err); // an error occurred
        } else {
            console.log('Buckets!: '+data); // successful response
        }
    });
}

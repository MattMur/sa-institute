/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 8:16 PM
 * To change this template use File | Settings | File Templates.
 */
var mysql      = require('mysql');
var local_db_config = {
    host     : '127.0.0.1',
    user     : 'root',
    database : 'institute'
};

var aws_db_config = {
    host     : 'aa16kng1n50tqcy.cyp63uyd0j62.us-east-1.rds.amazonaws.com:3306',
    user     : 'ebroot',
    database : 'institute'
};



console.log('Creating new SQL connection');
var connection = mysql.createConnection(aws_db_config);

connection.connect(function(err) {
    if (err) {
        console.log('Could not connect to Database!!');
    }
});

connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        connection = mysql.createConnection(db_config);  // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                 // server variable configures this)
    }
});




module.exports = connection;

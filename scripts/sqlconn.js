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
    port     : '3306',
    user     : 'ebroot',
    database : 'institute'
};
aws_db_config.host = process.env.PARAM1;
aws_db_config.password = process.env.PARAM2;


var aws_db_test = {
    host     : 'aa16kng1n50tqcy.cyp63uyd0j62.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'ebroot',
    password : 'password',
    database : 'institute'
};



console.log('Creating new SQL connection.');
console.log(JSON.stringify(process.env));
if (process.env.PARAM1) {
    console.log('Host: '+process.env.PARAM1 +' '+process.env.PARAM2);
}
var connection;


function handleConnection() {
    connection = mysql.createConnection(aws_db_test); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db: '+ err);
            setTimeout(handleConnection, 2000); // We introduce a delay before attempting to reconnect,
        } else {
            console.log('Connected to database.')
        }                                    // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error'+ err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleConnection();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleConnection();




module.exports = connection;

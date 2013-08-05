/**
 * Created with JetBrains WebStorm.
 * User: mattmurray
 * Date: 8/1/13
 * Time: 8:16 PM
 * To change this template use File | Settings | File Templates.
 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    database : 'InstituteSchema'
});

function handleDisconnect(connection) {
    connection.on('error', function(err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        connection = mysql.createConnection(connection.config);
        handleDisconnect(connection);
        connection.connect();
    });
}

handleDisconnect(connection);


exports.connect = function(callback) {
    connection.connect(callback);
};

exports.perform = function(query, callback) {
    connection.query(query, callback);
};

exports.end = function () {
    connection.end();
};
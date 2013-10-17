/**
 * Created by mattmurray on 10/17/13.
 */

// Create CSV file of email contacts, then download it.
app.factory('exportCSV', function() {

    return function(users, fileName) {
        if (typeof fileName !== 'string') return;
        if (!users || users.length == 0) return;
        var csv = "First Name,Last Name,E-mail Address,Mobile Phone\n";
        for (var i=0; i < users.length; i++) {
            csv += (users[i].firstname || '') +','
                + (users[i].lastname || '') +','
                + (users[i].email || '') +','
                + (users[i].phone || '');
            csv += '\n';
        }
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName+".csv");
    }

});